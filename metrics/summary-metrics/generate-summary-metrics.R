library(rgbif)
library(dplyr)
library(httr)
library(jsonlite)

# Parse command-line arguments
args <- commandArgs(trailingOnly = TRUE)
current_year <- 2026
previous_year <- 2025
two_years_ago <- 2024
three_years_ago <- 2023
lit_start_year <- 2008

if (length(args) > 0) {
  for (i in seq_along(args)) {
    if (args[i] == "--current-year" && i < length(args)) {
      current_year <- as.integer(args[i + 1])
    } else if (args[i] == "--previous-year" && i < length(args)) {
      previous_year <- as.integer(args[i + 1])
    } else if (args[i] == "--two-years-ago" && i < length(args)) {
      two_years_ago <- as.integer(args[i + 1])
    } else if (args[i] == "--three-years-ago" && i < length(args)) {
      three_years_ago <- as.integer(args[i + 1])
    } else if (args[i] == "--lit-start-year" && i < length(args)) {
      lit_start_year <- as.integer(args[i + 1])
    }
  }
}

cat("Using year parameters:\n")
cat("  Current year:", current_year, "\n")
cat("  Previous year:", previous_year, "\n")
cat("  Two years ago:", two_years_ago, "\n")
cat("  Three years ago:", three_years_ago, "\n")
cat("  Literature start year:", lit_start_year, "\n\n")

# Country codes to process
countries <- c("AU", "BW", "CO", "DK")

# Function to get literature count from GBIF API
get_literature_count <- function(country_code, year_range = NULL) {
  base_url <- "https://api.gbif.org/v1/literature/search"
  
  params <- list(
    publishingCountry = country_code,
    limit = 0  # We only need the count, not the results
  )
  
  if (!is.null(year_range)) {
    params$year <- year_range
  }
  
  response <- GET(base_url, query = params)
  
  if (status_code(response) == 200) {
    content <- content(response, as = "parsed")
    return(content$count)
  } else {
    warning(paste("Failed to fetch literature count for", country_code))
    return(0)
  }
}

# Function to get occurrence count from GBIF
get_occurrence_count <- function(country_code) {
  # Use GBIF occurrence search to get total count
  search_result <- occ_search(
    country = country_code,
    limit = 0
  )
  return(search_result$meta$count)
}

# Function to get dataset count from GBIF
get_dataset_count <- function(country_code) {
  base_url <- "https://api.gbif.org/v1/dataset/search"
  
  params <- list(
    publishingCountry = country_code,
    limit = 0
  )
  
  response <- GET(base_url, query = params)
  
  if (status_code(response) == 200) {
    content <- content(response, as = "parsed")
    return(content$count)
  } else {
    return(0)
  }
}

# Function to get organization count from GBIF
get_organization_count <- function(country_code) {
  base_url <- "https://api.gbif.org/v1/organization"
  
  params <- list(
    country = country_code,
    limit = 0
  )
  
  response <- GET(base_url, query = params)
  
  if (status_code(response) == 200) {
    content <- content(response, as = "parsed")
    return(content$count)
  } else {
    return(0)
  }
}

# Create output directory if it doesn't exist
if (!dir.exists("../../ui/public/data/summary-metrics")) {
  dir.create("../../ui/public/data/summary-metrics", recursive = TRUE)
}

# Process each country
for (country in countries) {
  cat(paste("\nProcessing", country, "...\n"))
  
  # Get literature metrics
  # Total since lit_start_year
  lit_total <- get_literature_count(country, paste0(lit_start_year, ",", previous_year))
  cat(paste("  Literature total since", lit_start_year, ":", lit_total, "\n"))
  
  # Previous year
  lit_prev <- get_literature_count(country, as.character(previous_year))
  cat(paste("  Literature", previous_year, ":", lit_prev, "\n"))
  
  # Two years ago for growth calculation
  lit_two_ago <- get_literature_count(country, as.character(two_years_ago))
  cat(paste("  Literature", two_years_ago, ":", lit_two_ago, "\n"))
  
  # Get occurrence count
  occ_count <- get_occurrence_count(country)
  cat(paste("  Total occurrences:", format(occ_count, big.mark = ","), "\n"))
  
  # Get dataset count
  dataset_count <- get_dataset_count(country)
  cat(paste("  Datasets:", dataset_count, "\n"))
  
  # Get organization count
  org_count <- get_organization_count(country)
  cat(paste("  Organizations:", org_count, "\n"))
  
  # Format numbers for display
  format_number <- function(num) {
    if (num >= 1000000) {
      return(paste0(round(num / 1000000, 1), " M"))
    } else if (num >= 1000) {
      return(format(num, big.mark = ","))
    } else {
      return(as.character(num))
    }
  }
  
  # Create summary metrics object
  summary_metrics <- list(
    countryCode = country,
    totalOccurrences = format_number(occ_count),
    totalOccurrencesRaw = occ_count,
    datasets = as.character(dataset_count),
    datasetsRaw = dataset_count,
    organizations = paste(org_count, "organizations in", country),
    organizationsRaw = org_count,
    literatureCount = as.character(lit_2024),
    literatureCountRaw = lit_2024,
    literatureTotal = paste(lit_total, "articles since 2008"),
    literatureTotalRaw = lit_total,
    literatureYearOverYear = if (lit_two_ago > 0) {
      round(((lit_prev - lit_two_ago) / lit_two_ago) * 100, 1)
    } else {
      0
    },
    generatedDate = Sys.Date()
  )
  
  # Save to JSON file
  output_file <- paste0("../../ui/public/data/summary-metrics/", country, "-summary-metrics.json")
  write_json(summary_metrics, output_file, pretty = TRUE, auto_unbox = TRUE)
  
  cat(paste("  Saved to", output_file, "\n"))
  
  # Be nice to the API
  Sys.sleep(1)
}

cat("\n✓ Summary metrics generation complete!\n")
