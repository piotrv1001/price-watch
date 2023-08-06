import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { ExportDataDTO } from "src/app/models/dto/export-data.dto";
import { ExportService } from "src/app/services/export.service";

@Component({
  selector: 'app-excel-export-btn',
  templateUrl: './excel-export-btn.component.html',
  styleUrls: ['./excel-export-btn.component.scss']
})
export class ExcelExportBtnComponent implements OnDestroy {

  @Input() exportData: ExportDataDTO | null = null;
  @Output() downloadProgressChange: EventEmitter<number> = new EventEmitter<number>();
  subs: Subscription[] = [];

  constructor(private exportService: ExportService) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  downloadExcel(): void {
    if(!this.exportData) {
      console.error('Export data is empty');
      return;
    }
    this.downloadProgressChange.emit(0);
    this.subs.push(
      this.exportService.downloadExcel(this.exportData).subscribe({
        next: (event: HttpEvent<Blob>) => {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
              if(event.total) {
                const progress = Math.round((100 * event.loaded) / event.total);
                this.downloadProgressChange.emit(progress);
              }
              break;
            case HttpEventType.Response:
              const blob = event.body;
              if(!blob) {
                console.error('Error while downloading file');
                return;
              }
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'exported_data.xlsx';
              link.click();
              URL.revokeObjectURL(link.href);
              break;
          }
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
