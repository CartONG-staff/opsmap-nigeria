import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

export type TKLabel = Record<string, string>;

export function TKGetLocalValue(
  label: TKLabel | string | undefined,
  locale: string
): string {
  return label
    ? (label as TKLabel)[locale] ??
        (label as TKLabel)[
          TKConfigurationModule.configuration.locale.default
        ] ??
        label ??
        ""
    : "";
}
