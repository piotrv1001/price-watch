import { Injectable } from '@nestjs/common';
import { ExportDataDTO } from './dto/export-data.dto';
import { FileSystemService } from 'src/file-system/file-system.service';
import * as ExcelJS from 'exceljs';
import { ExcelExporter } from './excel/excel-exporter';

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
}
