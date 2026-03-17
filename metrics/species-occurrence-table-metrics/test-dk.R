library(httr)
library(jsonlite)

# Configuration
API_BASE_URL <- "http://localhost:8081/api/species-occurrence-table"
COUNTRY_CODE <- "DK"
COUNTRY_NAME <- "Denmark"

# Sample test data for Denmark
# In production, this would come from GBIF downloads
test_data <- list(
  countryCode = COUNTRY_CODE,
  countryName = COUNTRY_NAME,
  taxonomicGroups = list(
    list(
      group = "Birds",
      occurrences = 909585,
      species = 684,
      occurrenceGrowth = 0.63,
      speciesGrowth = 0.0
    ),
    list(
      group = "Flowering Plants",
      occurrences = 850000,
      species = 8237,
      occurrenceGrowth = 2.1,
      speciesGrowth = 0.5
    ),
    list(
      group = "Insects",
      occurrences = 650000,
      species = 5200,
      occurrenceGrowth = 4.2,
      speciesGrowth = 1.8
    ),
    list(
      group = "Mammals",
      occurrences = 125000,
      species = 89,
      occurrenceGrowth = 1.5,
      speciesGrowth = 0.0
    ),
    list(
      group = "Fungi",
      occurrences = 95000,
      species = 2100,
      occurrenceGrowth = 3.8,
      speciesGrowth = 2.1
    )
  )
)

# Function to upload test data to backend
cat("Testing Species Occurrence Table API for", COUNTRY_NAME, "\n\n")

# Check if backend is running
cat("1. Checking if backend is running...\n")
tryCatch({
  health_check <- GET(paste0("http://localhost:8081/api/species-occurrence-table"))
  if (status_code(health_check) %in% c(200, 404)) {
    cat("✓ Backend is running\n\n")
  } else {
    stop("Backend returned unexpected status: ", status_code(health_check))
  }
}, error = function(e) {
  cat("✗ Backend is not running. Please start the backend first.\n")
  cat("Error:", e$message, "\n")
  stop("Cannot proceed without backend")
})

# Check if data already exists
cat("2. Checking for existing data for", COUNTRY_CODE, "...\n")
country_url <- paste0(API_BASE_URL, "/country/", COUNTRY_CODE)
check_response <- GET(country_url)

if (status_code(check_response) == 200) {
  existing_data <- content(check_response)
  existing_id <- existing_data$id
  cat("Found existing data (ID:", existing_id, ")\n")
  cat("Deleting existing data...\n")
  delete_url <- paste0(API_BASE_URL, "/", existing_id)
  DELETE(delete_url)
  Sys.sleep(0.5)
  cat("✓ Deleted\n\n")
} else {
  cat("No existing data found\n\n")
}

# Create new test data
cat("3. Creating new test data for", COUNTRY_NAME, "...\n")
response <- POST(
  API_BASE_URL,
  body = toJSON(test_data, auto_unbox = TRUE),
  content_type_json(),
  encode = "json"
)

if (status_code(response) %in% c(200, 201)) {
  cat("✓ Successfully created test data\n\n")
  
  created_data <- content(response)
  cat("Response:\n")
  cat("  ID:", created_data$id, "\n")
  cat("  Country:", created_data$countryName, "(", created_data$countryCode, ")\n")
  cat("  Taxonomic Groups:", length(created_data$taxonomicGroups), "\n")
  cat("  Last Modified:", created_data$lastModified, "\n")
  cat("  Data Source:", created_data$dataSource, "\n\n")
  
  # Display the groups
  cat("Taxonomic Groups:\n")
  for (group in created_data$taxonomicGroups) {
    cat(sprintf("  - %-20s: %10s occurrences, %5s species (Occ: %+.1f%%, Spp: %+.1f%%)\n",
                group$group,
                format(group$occurrences, big.mark = ","),
                format(group$species, big.mark = ","),
                group$occurrenceGrowth,
                group$speciesGrowth))
  }
  
} else {
  cat("✗ Failed to create test data\n")
  cat("Status code:", status_code(response), "\n")
  cat("Response:", content(response, as = "text"), "\n")
}

# Verify by fetching the data again
cat("\n4. Verifying by fetching data from API...\n")
verify_response <- GET(country_url)

if (status_code(verify_response) == 200) {
  verified_data <- content(verify_response)
  cat("✓ Successfully retrieved data\n")
  cat("  Country:", verified_data$countryName, "\n")
  cat("  Groups:", length(verified_data$taxonomicGroups), "\n")
} else {
  cat("✗ Failed to retrieve data\n")
}

cat("\n=== Test Complete ===\n")
cat("You can now test the API with:\n")
cat("  curl http://localhost:8081/api/species-occurrence-table/country/DK\n")
