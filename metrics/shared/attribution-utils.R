# GBIF Download Attribution Utilities
# Helper functions for capturing download metadata (DOI, created date)

#' Get attribution metadata for a GBIF download
#'
#' Fetches metadata for a GBIF download key using occ_download_meta() and
#' extracts DOI and created date for attribution purposes. Results are cached
#' to avoid repeated API calls.
#'
#' @param download_key Character string of GBIF download key
#' @param cache_dir Directory to store cached metadata (default: current directory)
#' @return List with downloadKey, doi, and created fields, or NULL if metadata unavailable
#' @export
get_download_attribution <- function(download_key, cache_dir = ".") {
  if (is.null(download_key) || nchar(download_key) == 0) {
    cat("Warning: Invalid download key provided\n")
    return(NULL)
  }
  
  # Check for cached metadata first
  cache_file <- file.path(cache_dir, paste0(download_key, "-meta.json"))
  
  if (file.exists(cache_file)) {
    cat("Found cached attribution metadata for", download_key, "\n")
    tryCatch({
      cached_data <- jsonlite::read_json(cache_file)
      return(cached_data)
    }, error = function(e) {
      cat("Warning: Failed to read cached metadata, fetching fresh data\n")
    })
  }
  
  # Fetch metadata from GBIF API
  cat("Fetching attribution metadata for download:", download_key, "\n")
  
  tryCatch({
    meta <- rgbif::occ_download_meta(download_key)
    
    # Extract attribution fields and convert to plain types
    attribution <- list(
      downloadKey = as.character(download_key),
      doi = as.character(meta$doi),
      created = as.character(meta$created)
    )
    
    cat("  DOI:", attribution$doi, "\n")
    cat("  Created:", attribution$created, "\n")
    
    # Cache the result
    tryCatch({
      jsonlite::write_json(
        attribution, 
        cache_file, 
        auto_unbox = TRUE, 
        pretty = TRUE
      )
      cat("  Cached metadata to", cache_file, "\n")
    }, error = function(e) {
      cat("  Warning: Failed to cache metadata:", e$message, "\n")
    })
    
    return(attribution)
    
  }, error = function(e) {
    cat("Warning: Failed to fetch attribution metadata:", e$message, "\n")
    cat("  Download key:", download_key, "\n")
    return(NULL)
  })
}

#' Get attribution metadata for multiple GBIF downloads
#'
#' Convenience wrapper for getting attribution for multiple download keys.
#' Returns an array of attribution objects (excludes NULL entries for failed fetches).
#'
#' @param download_keys Character vector of GBIF download keys
#' @param cache_dir Directory to store cached metadata (default: current directory)
#' @return List of attribution objects (empty list if all fail)
#' @export
get_multiple_download_attributions <- function(download_keys, cache_dir = ".") {
  if (length(download_keys) == 0) {
    cat("Warning: No download keys provided\n")
    return(list())
  }
  
  cat("\nFetching attribution metadata for", length(download_keys), "downloads...\n")
  
  attributions <- lapply(download_keys, function(key) {
    get_download_attribution(key, cache_dir)
  })
  
  # Filter out NULL entries (failed fetches)
  attributions <- Filter(Negate(is.null), attributions)
  
  cat("Successfully retrieved", length(attributions), "of", length(download_keys), "attributions\n")
  
  return(attributions)
}
