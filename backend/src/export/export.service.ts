import { Injectable } from '@nestjs/common';
import { ExportDataDTO } from './dto/export-data.dto';
import { FileSystemService } from 'src/file-system/file-system.service';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

@Injectable()
export class ExportService {
  constructor(private readonly fileSystemService: FileSystemService) {}
  async exportTableToXls(
    exportDataDTO: ExportDataDTO,
  ): Promise<ExcelJS.Buffer> {
    await this.fileSystemService.createTempFolder();
    const { title, columns, data, seller } = exportDataDTO;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(seller);
    worksheet.columns = columns;
    worksheet.getRow(2).values = columns.map((column) => column.header);
    this.addMergedCellTitle(worksheet, title, 1, 1, 1, columns.length);
    if (data?.length === 0) {
      this.addNoDataCell(worksheet, 'No data', 3, 3, 1, columns.length);
    }
    const tempFolder = 'temp';
    let row = 3;
    for (const item of data) {
      const product = this.mapNewProduct(item);
      const tempFileName = path.join(tempFolder, `${item.id}.png`);
      await this.downloadImage(
        tempFileName,
        item.imgSrc,
        workbook,
        worksheet,
        { col: 0, row },
        { col: 1, row: row + 2 },
      );
      this.addMergedCell(worksheet, product.name, row, 2, row + 2, 2);
      this.addMergedCell(worksheet, product.currPrice, row, 3, row + 2, 3);
      this.addMergedCell(
        worksheet,
        product.link,
        row,
        4,
        row + 2,
        4,
        undefined,
        true,
      );
      row += 3;
    }
    const buffer = await workbook.xlsx.writeBuffer();
    await this.fileSystemService.deleteTempFolder();
    return buffer;
  }

  private mapNewProduct(product: any): any {
    return {
      name: product.name,
      currPrice: `${product.currPrice} zł`,
      link: product.link,
    };
  }

  private addMergedCell(
    worksheet: ExcelJS.Worksheet,
    title: string,
    row: number,
    col: number,
    endRow: number,
    endCol: number,
    fontColor = undefined,
    isLink = false,
  ) {
    const cell = worksheet.getCell(row, col);
    if (isLink) {
      cell.value = { text: 'Link', hyperlink: title };
      cell.font = { color: { argb: 'FF0000FF' }, underline: true };
    } else {
      cell.value = title;
    }
    if (fontColor) {
      cell.style = { font: { color: { argb: fontColor } } };
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(row, col, endRow, endCol);
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

  private async downloadImage(
    tempFileName: string,
    imageUrl: string,
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    tl: any,
    br: any,
  ): Promise<void> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const writeFileAsync = util.promisify(fs.writeFile);
      await writeFileAsync(tempFileName, response.data);
      const imageId = workbook.addImage({
        filename: tempFileName,
        extension: 'png',
      });
      worksheet.addImage(imageId, { tl, br });
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }
}
