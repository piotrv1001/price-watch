import { Injectable } from '@nestjs/common';
import { ExportDataDTO } from './dto/export-data.dto';
import { FileSystemService } from 'src/file-system/file-system.service';
import * as ExcelJS from 'exceljs';
import { ExcelExporter } from './excel/excel-exporter';
import { Response } from 'express';
import { PdfExporter } from './pdf/pdf-exporter';

@Injectable()
export class ExportService {
  constructor(private readonly fileSystemService: FileSystemService) {}
  async exportTableToXls(
    exportDataDTO: ExportDataDTO,
  ): Promise<ExcelJS.Buffer> {
    await this.fileSystemService.createTempFolder();
    const excelExporter = new ExcelExporter(exportDataDTO);
    await excelExporter.createFile();
    const buffer = await excelExporter.getBuffer();
    await this.fileSystemService.deleteTempFolder();
    return buffer;
  }

  async exportTableToPdf(
    exportDataDTO: ExportDataDTO,
    res: Response,
  ): Promise<any> {
    const pdfExporter = new PdfExporter(exportDataDTO, res);
    await pdfExporter.createFile();
  }
}
