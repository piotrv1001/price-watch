import { Component, Input } from "@angular/core";
import { UIChart } from "primeng/chart";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-chart-export-png-btn',
  templateUrl: './chart-export-png-btn.component.html',
  styleUrls: ['./chart-export-png-btn.component.scss']
})
export class ChartExportPngBtnComponent {
  @Input() chartComponent?: UIChart;
  @Input() filename = 'chart';
  @Input() disabled = false;

  async downloadPng(): Promise<void> {
    const canvas = this.chartComponent?.chart?.canvas;
    const canvasImg = await html2canvas(canvas);
    const imageUri = canvasImg.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = `${this.filename}.png`;
    link.click();
  }
}
