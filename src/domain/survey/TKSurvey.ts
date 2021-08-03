/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKCampDescription, TKCampTypesValues } from "./TKCampDescription";
import { TKBoundariesCollection } from "./TKBoundariesCollection";
import { TKSubmission, TKCreateSubmission } from "./TKSubmission";
import { TKIndicator } from "../ui/TKIndicator";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKIndicatorsDescription,
  TKIndicatorDescription
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { isNumber } from "@turf/helpers";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";
import moment from "moment";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurvey {
  submissionsByCamps: { [campId: string]: { [date: string]: TKSubmission } };
  dateOfSubmissionsByCamps: { [campId: string]: string[] };
  campsList: TKCampDescription[];
  boundariesList: TKBoundariesCollection;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
  fdf: TKFDF;
}

// ////////////////////////////////////////////////////////////////////////////
// sort dates
// ////////////////////////////////////////////////////////////////////////////

function formatDate(date: string, fdf: TKFDF): string {
  if (fdf.terminology.date_format) {
    const day = moment(date, fdf.terminology.date_format);
    return day.format("DD/MM/YYYY");
  }

  return date;
}

// ////////////////////////////////////////////////////////////////////////////
// sort dates
// ////////////////////////////////////////////////////////////////////////////

function sortDates(dates: string[]) {
  dates.sort((a: string, b: string) => {
    const asplitted = a.split("/");
    const bsplitted = b.split("/");
    if (asplitted.length !== 3 || bsplitted.length !== 3) {
      return 0;
    }
    const adated = new Date(
      parseInt(asplitted[2]),
      parseInt(asplitted[1]) - 1,
      parseInt(asplitted[0])
    );
    const bdated = new Date(
      parseInt(bsplitted[2]),
      parseInt(bsplitted[1]) - 1,
      parseInt(bsplitted[0])
    );
    if (adated < bdated) return 1;
    else if (adated > bdated) return -1;
    else return 0;
  });
  return dates;
}

// ////////////////////////////////////////////////////////////////////////////
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr: TKIndicatorDescription,
  data: { [campId: string]: { [date: string]: TKSubmission } },
  sortedDates: { [date: string]: string[] }
): TKIndicator {
  if (descr.entryCode === "mp_site_id") {
    return {
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: {
        en: String(Object.keys(data).length)
      }
    };
  }

  let foundAtLeastOnce = false;
  let thematicName = "";
  let itemIndex = -1;
  let sum = 0;

  for (const camp in data) {
    const last = sortedDates[camp][0];
    const submission = data[camp][last];
    if (submission) {
      if (!foundAtLeastOnce) {
        for (const thematic in submission.thematics) {
          const them = submission.thematics[thematic];
          itemIndex = them.data.findIndex(
            item => item.field === descr.entryCode
          );
          if (itemIndex > -1) {
            foundAtLeastOnce = true;
            thematicName = thematic;
            break;
          }
        }
      }

      if (
        foundAtLeastOnce &&
        submission.thematics &&
        submission.thematics[thematicName] &&
        submission.thematics[thematicName].data &&
        submission.thematics[thematicName].data[itemIndex]
      ) {
        const item = submission.thematics[thematicName].data[itemIndex];
        if (
          item &&
          item instanceof TKSubmissionEntryText &&
          item.answerLabel &&
          isNumber(item.answerLabel.en)
        ) {
          sum += Number(item.answerLabel.en);
        }
      }
    }
  }
  if (!foundAtLeastOnce) {
    return {
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: { en: "-" }
    };
  }

  return {
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { en: String(sum) }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Survey Creation Method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSurvey(
  submissions: any[],
  surveyConfig: TKFDF,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription
): TKSurvey {
  const submissionsByCamps: {
    [campId: string]: { [date: string]: TKSubmission };
  } = {};
  const campsList: TKCampDescription[] = [];
  const boundariesList: TKBoundariesCollection = {
    admin1: [],
    admin2: []
  };

  submissions.map(submission => {
    submission[spatialDescription.siteLastUpdateField] = formatDate(
      submission[spatialDescription.siteLastUpdateField],
      surveyConfig
    );
  });

  for (const submission of submissions) {
    // If no previous submission for the camp
    if (!submissionsByCamps[submission[spatialDescription.siteIDField]]) {
      // Create data structure for future submissions
      submissionsByCamps[submission[spatialDescription.siteIDField]] = {};

      // Create the camp
      campsList.push({
        id: submission[spatialDescription.siteIDField],
        name: submission[spatialDescription.siteNameField],
        type: surveyConfig.terminology[
          submission[spatialDescription.siteTypeField]
        ] as TKCampTypesValues,
        lat: Number(
          submission[spatialDescription.siteLatitudeField].replace(",", ".")
        ),
        lng: Number(
          submission[spatialDescription.siteLongitudeField].replace(",", ".")
        ),
        admin1: {
          pcode: submission[spatialDescription.adm1Pcode],
          name: submission[spatialDescription.adm1Name]
        },
        admin2: {
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        },
        admin3: {
          pcode: submission[spatialDescription.adm3Pcode],
          name: submission[spatialDescription.adm3Name]
        },
        lastSubmission: ""
      });

      // Add the admin2 if it doesn't exists
      if (
        !boundariesList.admin2
          .map(x => x.pcode)
          .includes(submission[spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        });
      }

      // Add the admin1 if it doesn't exists
      if (
        !boundariesList.admin1
          .map(x => x.pcode)
          .includes(submission[spatialDescription.adm1Pcode])
      ) {
        boundariesList.admin1.push({
          pcode: submission[spatialDescription.adm1Pcode],
          name: submission[spatialDescription.adm1Name]
        });
      }
    }

    // Add the submissions
    submissionsByCamps[submission[spatialDescription.siteIDField]][
      submission[spatialDescription.siteLastUpdateField]
    ] = TKCreateSubmission(submission, surveyConfig, indicatorsDescription);
  }

  // Sort the dates
  const dateOfSubmissionsByCamps: { [site: string]: string[] } = {};
  for (const camp of Object.keys(submissionsByCamps)) {
    dateOfSubmissionsByCamps[camp] = sortDates(
      Object.keys(submissionsByCamps[camp])
    );
  }

  // Update last submission date for each camp
  campsList.map(camp => {
    camp.lastSubmission = dateOfSubmissionsByCamps[camp.id].length
      ? dateOfSubmissionsByCamps[camp.id][0]
      : "-";
  });

  return {
    submissionsByCamps: submissionsByCamps,
    dateOfSubmissionsByCamps: dateOfSubmissionsByCamps,
    campsList: campsList,
    boundariesList: boundariesList,
    indicators: [
      computeSurveyIndicator(
        indicatorsDescription.home[0],
        submissionsByCamps,
        dateOfSubmissionsByCamps
      ),
      computeSurveyIndicator(
        indicatorsDescription.home[1],
        submissionsByCamps,
        dateOfSubmissionsByCamps
      ),
      computeSurveyIndicator(
        indicatorsDescription.home[2],
        submissionsByCamps,
        dateOfSubmissionsByCamps
      )
    ],
    fdf: surveyConfig
  };
}
