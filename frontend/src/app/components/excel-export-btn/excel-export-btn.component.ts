import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ExportService } from "src/app/services/export.service";

@Component({
  selector: 'app-excel-export-btn',
  templateUrl: './excel-export-btn.component.html',
  styleUrls: ['./excel-export-btn.component.scss']
})
export class ExcelExportBtnComponent implements OnDestroy {

  subs: Subscription[] = [];

  constructor(private exportService: ExportService) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  downloadExcel(): void {
    const exportDataDTO = {
      title: 'Example',
      columns: [
        { header: 'Header 1', key: 'header1', width: 12 },
        { header: 'Header 2', key: 'header2', width: 12 },
        { header: 'Header 3', key: 'header3', width: 12 },
        { header: 'Header 4', key: 'header4', width: 12 }
      ],
      data: [],
      seller: 'Seller'
    };
    this.subs.push(
      this.exportService.downloadExcel(exportDataDTO).subscribe((blob: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'exported_data.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
      })
    );
  }
}
