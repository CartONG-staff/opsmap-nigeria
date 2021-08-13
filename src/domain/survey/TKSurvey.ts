/* eslint-disable @typescript-eslint/no-explicit-any */

import { TKCampTypesValues } from "./TKCamp";
import { TKBoundariesCollection } from "./TKBoundariesCollection";
import { TKCreateSubmission, TKSubmission } from "./TKSubmission";
import { TKIndicator } from "../ui/TKIndicator";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKIndicatorsDescription,
  TKIndicatorDescription
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import moment from "moment";
import { isNumber } from "@turf/turf";
import { TKCamp } from "@/domain/survey/TKCamp";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurvey {
  name: string;
  boundariesList: TKBoundariesCollection;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
  fdf: TKFDF;
  camps: TKCamp[];
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
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr: TKIndicatorDescription,
  camps: TKCamp[]
): TKIndicator {
  if (descr.entryCode === "mp_site_id") {
    return {
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: {
        en: String(camps.length)
      }
    };
  }

  let foundAtLeastOnce = false;
  let thematicName = "";
  let itemIndex = -1;
  let sum = 0;

  for (const camp of camps) {
    // TODO : improve last submission
    const submission = camp.submissions[0]; // camp.infos.lastSubmission];
    if (submission) {
      if (!foundAtLeastOnce) {
        for (const thematic in submission.thematics) {
          const them = submission.thematics[thematic];
          itemIndex = them.data.findIndex(
            item => item.type === "text" && item.field === descr.entryCode
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
          item.type === "text" &&
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
  submissions: Record<string, string>[],
  surveyConfig: TKFDF,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription,
  languages: Array<string>
): TKSurvey {
  const camps: TKCamp[] = [];

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
    // Doesn't exist in camps list
    let camp = camps.find(
      camp => camp.infos.id === submission[spatialDescription.siteIDField]
    );
    if (!camp) {
      camp = {
        infos: {
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
        },
        submissions: []
      };
      camps.push(camp);

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
    camp?.submissions.push(
      TKCreateSubmission(
        submission,
        surveyConfig,
        indicatorsDescription,
        spatialDescription,
        languages
      )
    );
  }

  // Sort the dates and update last submission date for each camp
  camps.map(camp =>
    camp.submissions.sort((a: TKSubmission, b: TKSubmission) => {
      const asplitted = a.date.split("/");
      const bsplitted = b.date.split("/");
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
    })
  );

  return {
    name: surveyConfig.name,
    camps: camps,
    boundariesList: boundariesList,
    indicators: [
      computeSurveyIndicator(indicatorsDescription.home[0], camps),
      computeSurveyIndicator(indicatorsDescription.home[1], camps),
      computeSurveyIndicator(indicatorsDescription.home[2], camps)
    ],
    fdf: surveyConfig
  };
}
