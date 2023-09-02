import { Component, Input } from '@angular/core';
import { HistogramData, HistogramOptions } from 'src/app/types/histogram/histogram';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
})
export class HistogramComponent {
  @Input() basicData?: HistogramData;
  @Input() basicOptions?: HistogramOptions;
  @Input() grouppedProducts: number[] = [0, 0, 0, 0];
  @Input() plugins: any[] = [ChartDataLabels];
  @Input() height = '400';
}
