import { Controller, Body, Res, Post } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportDataDTO } from './dto/export-data.dto';
import { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('excel')
  async exportTableToXls(
    @Body() exportDataDTO: ExportDataDTO,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportTableToXls(exportDataDTO);
    const filename = exportDataDTO.seller ?? 'export';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${filename}.xlsx`,
      'Content-Length': Buffer.byteLength(buffer),
    });
    res.send(buffer);
  }

  @Post('pdf')
  async exportTableToPdf(
    @Body() exportDataDTO: ExportDataDTO,
    @Res() res: Response,
  ) {
    await this.exportService.exportTableToPdf(exportDataDTO, res);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=table.pdf');
  }
}
