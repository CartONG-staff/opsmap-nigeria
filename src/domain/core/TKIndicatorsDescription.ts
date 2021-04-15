interface TKIndicatorDescription {
    readonly name: string;
    readonly entryCode: string;
    readonly iconOchaName: string;
}

export interface TKIndicatorsDescription {
    home: [TKIndicatorDescription, TKIndicatorDescription, TKIndicatorDescription];
    site: [TKIndicatorDescription, TKIndicatorDescription, TKIndicatorDescription];
}