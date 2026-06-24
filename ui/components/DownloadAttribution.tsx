import { ExternalLink } from 'lucide-react';
import type { DownloadAttribution as DownloadAttributionType } from '../data/dataset-types';

interface DownloadAttributionProps {
  attribution?: DownloadAttributionType | DownloadAttributionType[];
}

/**
 * Display GBIF download attribution with DOI link and creation date
 * Supports single attribution or multiple attributions
 */
export function DownloadAttribution({ attribution }: DownloadAttributionProps) {
  if (!attribution) {
    return null;
  }

  // Handle both single attribution and array of attributions
  const attributions = Array.isArray(attribution) ? attribution : [attribution];

  if (attributions.length === 0) {
    return null;
  }

  // Format date from ISO string (e.g., "2024-06-09T12:34:56Z") to readable format
  const formatDate = (isoDate: string): string => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      {attributions.map((attr, index) => (
        <a
          key={attr.downloadKey}
          href={`https://doi.org/${attr.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          <span>
            {attributions.length > 1 
              ? `Download ${index + 1} (generated ${formatDate(attr.created)})`
              : `Data source (generated ${formatDate(attr.created)})`
            }
          </span>
        </a>
      ))}
    </div>
  );
}
