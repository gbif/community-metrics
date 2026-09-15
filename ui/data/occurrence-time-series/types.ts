// Types for occurrence time series visualization
import type { DownloadAttribution } from '../dataset-types';

export interface TimeSeriesDataPoint {
  year: number;
  occurrenceCount: number;
}

export interface TaxonomicGroupTimeSeries {
  group: string;
  data: TimeSeriesDataPoint[];
}

export interface OccurrenceTimeSeriesData {
  countryCode: string;
  countryName: string;
  dataType: string;
  lastModified: string;
  taxonomicGroups: TaxonomicGroupTimeSeries[];
  downloadAttribution?: DownloadAttribution;
}
