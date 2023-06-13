export enum IconPosition {
  MAP,
  INTERFACE
}
export function TKIconUrl(
  name: string,
  mode: IconPosition = IconPosition.INTERFACE
): string {
  if (mode === IconPosition.INTERFACE) {
    return process.env.VUE_APP_ICONS_BASE_URL + name + ".svg";
  } else {
    return process.env.VUE_APP_ICONS_BASE_URL + name + ".png";
  }
}
