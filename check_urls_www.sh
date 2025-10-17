#!/bin/bash

# List of URLs to check with www
urls=(
  "https://www.legendsofbasketball.com/player-programs/"
  "https://www.legendsofbasketball.com/events/"
  "https://www.legendsofbasketball.com/membership/player-membership/"
  "https://www.legendsofbasketball.com/membership/legends-locker-room/"
  "https://www.legendsofbasketball.com/who-we-are/chapters/"
  "https://www.legendsofbasketball.com/who-we-are/board-of-directors/"
)

echo "Checking URLs with www..."
echo "=========================="
for url in "${urls[@]}"; do
  status=$(curl -I -s -L -o /dev/null -w "%{http_code}" "$url" --max-time 10)
  if [ "$status" -eq 200 ]; then
    echo "✓ $status - $url"
  else
    echo "✗ $status - $url"
  fi
done
