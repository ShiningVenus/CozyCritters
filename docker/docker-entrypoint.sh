#!/bin/sh
set -e

# Function to replace environment variables in HTML files
replace_env_vars() {
    find /usr/share/nginx/html -name "*.html" -type f -exec sh -c '
        for file; do
            # Replace environment variables in HTML files
            envsubst < "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        done
    ' sh {} +
}

# Replace environment variables in the built files
echo "Substituting environment variables in static files..."
replace_env_vars

echo "Environment variable substitution completed."