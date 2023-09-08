export interface HistogramData {
  labels: string[];
  datasets: HistogramDataset[];
}

export interface HistogramDataset {
  label?: string;
  data: number[];
  backgroundColor?: string[] | string;
  hoverBackgroundColor?: string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
  pointStyle?: string,
  pointRadius?: number,
  pointHoverRadius?: number,
}

export interface LegendLabels {
  color?: string | (() => string);
}

export interface Plugins {
  legend: {
    display?: boolean;
    position?: string;
    labels?: LegendLabels;
  };
  datalabels?: any;
  tooltip?: any;
}

export interface ScalesTicks {
  callback?: (value: any, index: number, values: any[]) => any;
  color?: string | (() => string);
}

export interface ScalesGrid {
  color?: string | (() => string);
  drawBorder: boolean;
}

export interface Scales {
  beginAtZero?: boolean;
  ticks?: ScalesTicks;
  grid?: ScalesGrid;
}

export interface HistogramOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  plugins?: Plugins;
  scales?: {
    y?: Scales;
    x?: Scales;
  };
  interaction?: {
    intersect?: boolean;
    mode?: string;
  }
}
