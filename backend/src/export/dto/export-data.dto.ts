import { ColumnDTO } from './column.dto';

export class ExportDataDTO {
  title?: string;
  columns?: ColumnDTO[];
  data?: any[];
  seller?: string;
  noDataText?: string;
}
