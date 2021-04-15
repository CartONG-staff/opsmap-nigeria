export enum TKIndicatorComputationType {
    SUM,
    MEAN
}


export interface TKIndicatorDescription {
    readonly name: string;
    readonly entryCode: string;
    readonly iconOchaName: string;
    readonly computationType?: TKIndicatorComputationType;
}

export interface TKIndicatorsDescription {
    home: [TKIndicatorDescription, TKIndicatorDescription, TKIndicatorDescription];
    site: [TKIndicatorDescription, TKIndicatorDescription, TKIndicatorDescription];
}