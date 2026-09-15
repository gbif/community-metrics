// TypeScript types for Species Occurrence Table data
import type { DownloadAttribution } from '../dataset-types';

export interface OccurrenceTableGroup {
  group: string;
  occurrences: number;
  species: number;
  occurrenceGrowth: number;
  speciesGrowth: number;
}

export interface SpeciesOccurrenceTableData {
  countryCode: string;
  countryName: string;
  publishedBy?: boolean;
  taxonomicGroups: OccurrenceTableGroup[];
  downloadAttributions?: DownloadAttribution[];
}
