import { Injectable } from '@nestjs/common';
import { ExportDataDTO } from './dto/export-data.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  async exportTableToXls(
    exportDataDTO: ExportDataDTO,
  ): Promise<ExcelJS.Buffer> {
    const { title, columns, data, seller } = exportDataDTO;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(seller);
    worksheet.columns = columns;
    worksheet.getRow(2).values = columns.map((column) => column.header);
    this.addMergedCellTitle(worksheet, title, 1, 1, 1, columns.length);
    if (data?.length === 0) {
      this.addNoDataCell(worksheet, 'No data', 3, 3, 1, columns.length);
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  private addMergedCellTitle(
    worksheet: ExcelJS.Worksheet,
    title: string,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
  ): void {
    const cell = worksheet.getCell(startRow, startCol);
    cell.value = title;
    cell.font = { bold: true, size: 14 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(startRow, startCol, endRow, endCol);
  }

  private addNoDataCell(
    worksheet: ExcelJS.Worksheet,
    title: string,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
  ): void {
    const cell = worksheet.getCell(startRow, startCol);
    cell.value = title;
    cell.font = { bold: false, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(startRow, startCol, endRow, endCol);
  }
}
