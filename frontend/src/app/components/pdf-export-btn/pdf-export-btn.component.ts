import { Component, Input } from "@angular/core";
import { ExportDataDTO } from "src/app/models/dto/export-data.dto";
import { ExportService } from "src/app/services/export.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-pdf-export-btn',
  templateUrl: './pdf-export-btn.component.html',
  styleUrls: ['./pdf-export-btn.component.scss']
})
export class PdfExportBtnComponent {

  @Input() exportData: ExportDataDTO | null = null;

  constructor(
    private exportService: ExportService,
    private toastService: ToastService
  ) {}

  downloadPdf(): void {
    this.exportService.downloadPdf({}).subscribe({
      next: (res) => {
        const blobUrl = URL.createObjectURL(res);
        const newTab = window.open('', '_blank');
        if(newTab) {
          newTab.document.title = 'table.pdf';
        }
        newTab?.document.write(`
          <html>
          <head><title>table.pdf</title></head>
          <body style="margin: 0; overflow: hidden;">
            <iframe width="100%" height="100%" src="${blobUrl}"></iframe>
          </body>
          </html>
        `);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'table.pdf';
        downloadLink.style.display = 'none';
        newTab?.document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 60000);
        // const blobUrl = URL.createObjectURL(res);
        // const downloadLink = document.createElement('a');
        // downloadLink.href = blobUrl;
        // downloadLink.download = 'table.pdf';
        // downloadLink.click();
        // window.open(blobUrl, '_blank');
        // URL.revokeObjectURL(blobUrl);
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }
}
