import moment from "moment";

export function TKDateCompare(
  date1: string,
  date2: string,
  displayDateFormat: string
): number {
  const date1Moment = moment(date1, displayDateFormat);
  const date2Moment = moment(date2, displayDateFormat);

  if (date1Moment.isSame(date2Moment)) {
    return 0;
  }
  if (date1Moment.isBefore(date2Moment)) {
    return 1;
  }
  return -1;
}

// ////////////////////////////////////////////////////////////////////////////
// sort dates
// ////////////////////////////////////////////////////////////////////////////

export function TKDateFormat(
  date: string,
  inputFormat: string,
  outputFormat: string
): string {
  if (inputFormat) {
    return moment(date, inputFormat).format(outputFormat);
  }

  return date;
}
