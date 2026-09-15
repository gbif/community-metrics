import { DatasetScatterData } from './types';

/**
 * Get dataset scatter plot data for a specific country from static JSON files
 */
export async function getDatasetScatterData(countryCode: string): Promise<DatasetScatterData | null> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/dataset-scatter/dataset-scatterplot-${countryCode.toUpperCase()}.json`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch dataset data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching dataset data for ${countryCode}:`, error);
    return null;
  }
}

/**
 * Get all available country codes for dataset data
 * Note: With static architecture, this would need to read from an index.json file
 */
export async function getAvailableCountryCodes(): Promise<string[]> {
  // TODO: Implement by reading from /data/index.json if needed
  console.warn('getAvailableCountryCodes not implemented for static architecture');
  return [];
  
  /* Old backend implementation:
  try {
    const response = await fetch(`/api/dataset-scatter`);
    if (!response.ok) {
      throw new Error(`Failed to fetch country codes: ${response.statusText}`);
    }
    const data: DatasetScatterData[] = await response.json();
    return data.map(item => item.countryCode);
  } catch (error) {
    console.error('Error fetching available country codes:', error);
    return [];
  }
  */
}

/**
 * Check if dataset data is available for a country
 */
export async function hasDatasetData(countryCode: string): Promise<boolean> {
  const data = await getDatasetScatterData(countryCode);
  return data !== null;
}

/**
 * Get summary statistics across all countries
 */
export async function getDatasetSummaryStats() {
  // TODO: Implement by aggregating all country JSON files if needed
  console.warn('getDatasetSummaryStats not implemented for static architecture');
  return {
    totalCountries: 0,
    totalDatasets: 0,
    totalSpecies: 0,
    totalOccurrences: 0,
    lastUpdated: 0
  };
  
  /* Old backend implementation:
  try {
    const response = await fetch(`${API_BASE_URL}/api/dataset-scatter`);
    if (!response.ok) {
      throw new Error(`Failed to fetch summary stats: ${response.statusText}`);
    }
    const allData: DatasetScatterData[] = await response.json();
    
    const totalCountries = allData.length;
    const totalDatasets = allData.reduce((sum, country) => sum + country.totalDatasets, 0);
    const totalSpecies = allData.reduce((sum, country) => 
      sum + Math.max(...country.datasets.map(d => d.species)), 0
    );
    const totalOccurrences = allData.reduce((sum, country) => 
      sum + country.datasets.reduce((countrySum, dataset) => countrySum + dataset.occurrences, 0), 0
    );
    
    const lastTimes = allData
      .map(d => d.lastModified ? new Date(d.lastModified).getTime() : 0);

    return {
      totalCountries,
      totalDatasets,
      totalSpecies,
      totalOccurrences,
      lastUpdated: Math.max(...lastTimes)
    };
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    return {
      totalCountries: 0,
      totalDatasets: 0,
      totalSpecies: 0,
      totalOccurrences: 0,
      lastUpdated: 0
    };
  }
  */
}