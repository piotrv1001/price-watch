import * as PDFDocument from 'pdfkit';
import { ExportDataDTO } from '../dto/export-data.dto';
import { Response } from 'express';

export class PdfExporter {
  document: PDFKit.PDFDocument | null = null;
  constructor(private exportDataDTO: ExportDataDTO, private res: Response) {}
  async createFile(): Promise<void> {
    this.document = new PDFDocument();
    this.document.pipe(this.res);
    this.document
      .fontSize(25)
      .text('Some text with an embedded font!', 100, 100);
    this.document.end();
  }
}
