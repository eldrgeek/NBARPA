#!/bin/bash

# List of URLs to check
urls=(
  "https://legendsofbasketball.com/player-programs/health-and-wellness/"
  "https://legendsofbasketball.com/player-programs/health-and-wellness/mental-health/"
  "https://legendsofbasketball.com/player-programs/health-and-wellness/health-insurance/"
  "https://legendsofbasketball.com/player-programs/player-funding/"
  "https://legendsofbasketball.com/player-programs/player-funding/member-grant-program/"
  "https://legendsofbasketball.com/player-programs/player-funding/dave-debusschere-scholarship/"
  "https://legendsofbasketball.com/player-programs/player-funding/earl-lloyd-scholarship/"
  "https://legendsofbasketball.com/legends-care/"
  "https://legendsofbasketball.com/legends-care/full-court-press/"
  "https://legendsofbasketball.com/legends-care/legends-hbcu-scholarship/"
  "https://legendsofbasketball.com/legends-care/donate-now/"
  "https://legendsofbasketball.com/events/events-calendar/"
  "https://legendsofbasketball.com/events/nba-all-star-weekend/"
  "https://legendsofbasketball.com/events/legends-annual-meeting/"
  "https://legendsofbasketball.com/events/wnba-all-star-weekend/"
  "https://legendsofbasketball.com/membership/"
  "https://legendsofbasketball.com/membership/player-membership/"
  "https://legendsofbasketball.com/membership/legends-locker-room/"
  "https://legendsofbasketball.com/membership/profiles/"
  "https://legendsofbasketball.com/who-we-are/chapters/"
  "https://legendsofbasketball.com/news/"
  "https://legendsofbasketball.com/media/"
  "https://legendsofbasketball.com/media/legends-magazine/"
  "https://legendsofbasketball.com/media/legends-lounge-with-trill-withers/"
  "https://legendsofbasketball.com/media/all-access-legends-podcast/"
  "https://legendsofbasketball.com/media/photos/"
  "https://legendsofbasketball.com/partners/"
  "https://legendsofbasketball.com/partners/sponsorship-opportunities/"
  "https://legendsofbasketball.com/partners/our-partners/"
  "https://legendsofbasketball.com/who-we-are/"
  "https://legendsofbasketball.com/who-we-are/board-of-directors/"
  "https://legendsofbasketball.com/contact/"
  "https://legendsofbasketball.com/player-programs/"
)

echo "Checking URLs..."
echo "================"
for url in "${urls[@]}"; do
  status=$(curl -I -s -L -o /dev/null -w "%{http_code}" "$url" --max-time 10)
  if [ "$status" -eq 200 ]; then
    echo "✓ $status - $url"
  else
    echo "✗ $status - $url"
  fi
done
