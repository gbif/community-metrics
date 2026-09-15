// GBIF Download Attribution
export interface DownloadAttribution {
  downloadKey: string;
  doi: string;
  created: string;
}

// Types for dataset scatter plot visualization
export interface DatasetPoint {
  id: string;
  name: string;
  species: number;
  occurrences: number;
  publishedInCountry: boolean;
  organization?: string;
  description?: string;
  publishingCountry?: string;
}

export interface DatasetScatterData {
  countryCode: string;
  countryName: string;
  totalDatasets: number;
  datasets: DatasetPoint[];
  downloadAttribution?: DownloadAttribution;
}

// Generate sample dataset data for countries
export const generateSampleDatasets = (countryCode: string, countryName: string): DatasetScatterData => {
  const datasets: DatasetPoint[] = [];
  
  // Sample datasets with realistic distributions
  const datasetNames = [
    'National Biodiversity Survey',
    'Coastal Marine Life Census',
    'Forest Inventory Project',
    'Urban Wildlife Monitoring',
    'Endemic Species Atlas',
    'Migratory Bird Tracking',
    'Herbarium Collections',
    'Museum Specimens',
    'Citizen Science Records',
    'Research Station Data',
    'Conservation Project Records',
    'Agricultural Pest Survey',
    'Invasive Species Database',
    'Protected Areas Inventory',
    'Traditional Knowledge Records'
  ];

  const organizations = [
    `${countryName} National Museum`,
    `${countryName} University`,
    `${countryName} Forest Service`,
    'International Conservation Org',
    'Global Biodiversity Institute',
    'Research Consortium',
    `${countryName} Parks Authority`,
    'Citizen Science Network'
  ];

  // Generate 20-30 datasets with varied scales
  const numDatasets = 20 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < numDatasets; i++) {
    const isPublishedInCountry = Math.random() > 0.3; // 70% published in country
    
    // Log-normal distribution for realistic dataset sizes
    const speciesLog = Math.random() * 4 + 1; // 10^1 to 10^5 species
    const occurrencesLog = speciesLog + Math.random() * 3; // Correlated but variable
    
    datasets.push({
      id: `dataset-${countryCode}-${i}`,
      name: datasetNames[Math.floor(Math.random() * datasetNames.length)],
      species: Math.floor(Math.pow(10, speciesLog)),
      occurrences: Math.floor(Math.pow(10, occurrencesLog)),
      publishedInCountry: isPublishedInCountry,
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      description: `Comprehensive ${isPublishedInCountry ? 'domestic' : 'international'} dataset covering biodiversity research in ${countryName}`,
      publishingCountry: isPublishedInCountry ? countryName : ['United States', 'United Kingdom', 'Germany', 'Netherlands'][Math.floor(Math.random() * 4)]
    });
  }

  // Sort by occurrences (descending)
  datasets.sort((a, b) => b.occurrences - a.occurrences);

  return {
    countryCode,
    countryName,
    totalDatasets: datasets.length,
    datasets
  };
};