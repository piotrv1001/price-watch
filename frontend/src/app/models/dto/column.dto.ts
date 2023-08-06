export class ColumnDTO {
  header?: string;
  key?: string;
  width?: number;
  isImage?: boolean;
  isLink?: boolean;
  formatOptions?: FormatOptions;
  customTemplate?: number;
}

export class FormatOptions {
  textColor?: string;
  bgColor?: string;
  prefix?: string;
  suffix?: string;
}

export enum CustomTemplate {
  PriceChange,
}
