export type StringOrNull = string | null;
export type NumberOrNull = number | null;
export type BooleanOrNull = boolean | null;
export type DateOrNull = Date | null;
export type CertainOrUncertainArray<T> = (T | null)[];
export type CertainOrUncertainArrayOrNull<T> =
  CertainOrUncertainArray<T> | null;
export type ValueOrNull<T> = T | null;
