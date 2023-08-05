import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { ExportService } from "src/app/services/export.service";

@Component({
  selector: 'app-excel-export-btn',
  templateUrl: './excel-export-btn.component.html',
  styleUrls: ['./excel-export-btn.component.scss']
})
export class ExcelExportBtnComponent implements OnDestroy {

  @Output() downloadProgressChange: EventEmitter<number> = new EventEmitter<number>();
  subs: Subscription[] = [];

  constructor(private exportService: ExportService) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  downloadExcel(): void {
    const imgSrc = 'https://a.allegroimg.com/s180/11d2e3/12a8d9bb4373a6b9e41e04225b06/Zasilacz-do-tasm-LED-12V-30W-dopuszkowy-do-puszki';
    const exportDataDTO = {
      title: 'New products',
      columns: [
        { header: '' },
        { header: 'Nazwa', key: 'name', width: 64 },
        { header: 'Cena', key: 'currPrice', width: 16 },
        { header: 'Link', key: 'link', width: 10 }
      ],
      data: [
        { name: 'Test 1', currPrice: 100, link: 'https://www.google.com/', imgSrc },
        { name: 'Test 2', currPrice: 120, link: 'https://www.google.com/', imgSrc },
        { name: 'Test 3', currPrice: 140, link: 'https://www.google.com/', imgSrc },
        { name: 'Test 4', currPrice: 160, link: 'https://www.google.com/', imgSrc },
      ],
      seller: 'Seller'
    };
    this.downloadProgressChange.emit(0);
    this.subs.push(
      this.exportService.downloadExcel(exportDataDTO).subscribe({
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
