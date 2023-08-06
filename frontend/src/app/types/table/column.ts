export interface TableColumn {
  header: string;
  field: string;
  ngStyle?: any;
  filter?: boolean;
  formatOptions?: FormatOptions;
}

export class FormatOptions {
  textColor?: string;
  bgColor?: string;
  prefix?: string;
  suffix?: string;
}
