/* eslint-disable @typescript-eslint/camelcase */

import { TKCampDescription } from "./TKCampDescription";
import { TKBoundariesCollection } from "./TKBoundariesCollection";
import { TKSubmission, TKCreateSubmission } from "./TKSubmission";
import { TKIndicator } from "../ui/TKIndicator";
import { TKSpatialDescription } from "@/domain/opsmapConfig/TKSpatialDescription";
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKIndicatorsDescription,
  TKIndicatorDescription,
  TKIndicatorComputationType
} from "@/domain/opsmapConfig/TKIndicatorsDescription";
import { isNumber } from "@turf/helpers";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";

// ////////////////////////////////////////////////////////////////////////////
// Survey concept definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurvey {
  submissionsByCamps: { [campId: string]: { [date: string]: TKSubmission } };
  campsList: TKCampDescription[];
  boundariesList: TKBoundariesCollection;
  indicators: [TKIndicator, TKIndicator, TKIndicator];
  fdf: TKFDF;
}

// ////////////////////////////////////////////////////////////////////////////
// helper method that compute survey indicator
// ////////////////////////////////////////////////////////////////////////////

function computeSurveyIndicator(
  descr: TKIndicatorDescription,
  data: { [campId: string]: { [date: string]: TKSubmission } }
): TKIndicator {
  if (descr.entryCode === "mp_site_id") {
    return {
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: {
        name: String(Object.keys(data).length),
        labelEn: String(Object.keys(data).length)
      }
    };
  }

  const splitted = descr.entryCode.split("_");
  if (splitted) {
    const thematic = "group_" + splitted[0];
    let sum = 0;
    for (const camp in data) {
      const last = Object.keys(data[camp])[0];
      const submission = data[camp][last];
      if (submission) {
        const them = submission.thematics[thematic];
        if (them) {
          const item = them.data.find(item => item.field === descr.entryCode);
          if (
            item &&
            item instanceof TKSubmissionEntryText &&
            item.answerLabel &&
            isNumber(item.answerLabel.labelEn)
          ) {
            sum += Number(item.answerLabel.labelEn);
          }
        }
      }
    }
    if (!descr.computationType) {
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { name: String(sum), labelEn: String(sum) }
      };
    }
    if (descr.computationType === TKIndicatorComputationType.MEAN) {
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: {
          name: String((sum / Object.keys(data).length).toFixed(2)),
          labelEn: String((sum / Object.keys(data).length).toFixed(2))
        }
      };
    } else if (descr.computationType === TKIndicatorComputationType.SUM) {
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: { name: String(sum), labelEn: String(sum) }
      };
    }
  }
  return {
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { name: "NotFound", labelEn: "NotFound" }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Survey Creation Method
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSurvey(
  sumbmissions: any[],
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
  for (const submission of sumbmissions) {
    if (submissionsByCamps[submission[spatialDescription.siteIDField]]) {
      campsList.map(x => {
        if (x.id === submission[spatialDescription.siteIDField]) {
          x.submissionsDates.push(
            submission[spatialDescription.siteLastUpdateField]
          );
        }
      });
      submissionsByCamps[submission[spatialDescription.siteIDField]][
        submission[spatialDescription.siteLastUpdateField]
      ] = TKCreateSubmission(submission, surveyConfig, indicatorsDescription);
    } else {
      campsList.push({
        id: submission[spatialDescription.siteIDField],
        name: submission[spatialDescription.siteNameField],
        type: submission[spatialDescription.siteTypeField],
        submissionsDates: [submission[spatialDescription.siteLastUpdateField]],
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
        }
      });
      if (
        !boundariesList.admin2
          .map(x => x.pcode)
          .includes(submission[spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        });
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

      submissionsByCamps[submission[spatialDescription.siteIDField]] = {
        [submission[
          spatialDescription.siteLastUpdateField
        ]]: TKCreateSubmission(submission, surveyConfig, indicatorsDescription)
      };
    }
  }

  return {
    submissionsByCamps: submissionsByCamps,
    campsList: campsList,
    boundariesList: boundariesList,
    indicators: [
      computeSurveyIndicator(indicatorsDescription.home[0], submissionsByCamps),
      computeSurveyIndicator(indicatorsDescription.home[1], submissionsByCamps),
      computeSurveyIndicator(indicatorsDescription.home[2], submissionsByCamps)
    ],
    fdf: surveyConfig
  };
}
