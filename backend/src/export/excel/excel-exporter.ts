import { ExportDataDTO } from '../dto/export-data.dto';
import * as ExcelJS from 'exceljs';
import axios from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { ColumnDTO } from '../dto/column.dto';

export class ExcelExporter {
  workbook: ExcelJS.Workbook | null = null;
  worksheet: ExcelJS.Worksheet | null = null;
  constructor(private exportDataDTO: ExportDataDTO) {}

  async createFile(): Promise<void> {
    const { columns, seller, data } = this.exportDataDTO;
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet(seller);
    this.worksheet.columns = columns;
    this.worksheet.getRow(2).values = columns.map((column) => column.header);
    this.addTableTitle();
    if (data?.length === 0) {
      this.addNoDataCell();
    }
    const containsImages = columns.some((col) => col.isImage);
    if (containsImages) {
      let currentRow = 3;
      for (const item of data) {
        let currentCol = 0;
        for (const col of columns) {
          if (col.isImage) {
            const tempFolder = 'temp';
            const id = item.id ?? Math.round(Math.random() * 1000);
            const tempFileName = path.join(tempFolder, `${id}.png`);
            await this.downloadImage(
              tempFileName,
              item.imgSrc,
              { col: currentCol, row: currentRow },
              { col: currentCol + 1, row: currentRow + 2 },
            );
          } else {
            const value = item[col.key];
            this.addMergedCell(
              value,
              col,
              currentRow,
              currentCol + 1, // 1-based index
              currentRow + 2,
              currentCol + 1, // 1-based index
            );
          }
          currentCol++;
        }
        currentRow += 3;
      }
    } else {
      let currentRow = 3;
      for (const item of data) {
        let currentCol = 0;
        for (const col of columns) {
          const cell = this.worksheet.getCell(currentRow, currentCol);
          cell.value = item[col.key];
          currentCol++;
        }
        currentRow++;
      }
    }
  }

  async getBuffer(): Promise<ExcelJS.Buffer> {
    return await this.workbook?.xlsx.writeBuffer();
  }

  addTableTitle(): void {
    const cell = this.worksheet.getCell(1, 1);
    const { title, columns } = this.exportDataDTO;
    cell.value = title;
    cell.font = { bold: true, size: 14 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    this.worksheet.mergeCells(1, 1, 1, columns.length);
  }

  addNoDataCell(): void {
    const cell = this.worksheet.getCell(3, 3);
    const { columns, noDataText } = this.exportDataDTO;
    cell.value = noDataText ?? 'No data';
    cell.font = { bold: false, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    this.worksheet.mergeCells(3, 1, 3, columns.length);
  }

  addMergedCell(
    value: any,
    col: ColumnDTO,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): void {
    const cell = this.worksheet.getCell(startRow, startCol);
    if (col.isLink) {
      cell.value = { text: 'Link', hyperlink: value };
      cell.font = { color: { argb: 'FF0000FF' }, underline: true };
    } else {
      cell.value = value;
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    this.worksheet.mergeCells(startRow, startCol, endRow, endCol);
  }

  private async downloadImage(
    tempFileName: string,
    imageUrl: string,
    tl: any,
    br: any,
  ): Promise<void> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const writeFileAsync = util.promisify(fs.writeFile);
      await writeFileAsync(tempFileName, response.data);
      const imageId = this.workbook.addImage({
        filename: tempFileName,
        extension: 'png',
      });
      this.worksheet.addImage(imageId, { tl, br });
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }
}
