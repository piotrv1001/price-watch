export interface HistogramData {
  labels: string[];
  datasets: HistogramDataset[];
}

export interface HistogramDataset {
  label?: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

export interface LegendLabels {
  color: string;
}

export interface LegendPlugins {
  legend: {
    labels: LegendLabels;
  };
}

export interface ScalesTicks {
  color: string;
}

export interface ScalesGrid {
  color: string;
  drawBorder: boolean;
}

export interface Scales {
  beginAtZero?: boolean;
  ticks?: ScalesTicks;
  grid?: ScalesGrid;
}

export interface HistogramOptions {
  plugins?: LegendPlugins;
  scales?: {
    y?: Scales;
    x?: Scales;
  };
}
