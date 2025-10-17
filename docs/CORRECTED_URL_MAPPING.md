# Corrected URL Mapping for Legends of Basketball Links

**Critical Issue Discovered:** 61% of URLs I created don't exist (return 404)

---

## WORKING URLS - Use These

### Main Sections (Confirmed Working)
| Purpose | Correct URL | Status |
|---------|------------|--------|
| Legends Care Hub | https://legendsofbasketball.com/legends-care/ | ✓ 200 |
| Full Court Press | https://legendsofbasketball.com/legends-care/full-court-press/ | ✓ 200 |
| Donate | https://legendsofbasketball.com/legends-care/donate-now/ | ✓ 200 |
| Membership | https://legendsofbasketball.com/membership/ | ✓ 200 |
| News | https://legendsofbasketball.com/news/ | ✓ 200 |
| Media Hub | https://legendsofbasketball.com/media/ | ✓ 200 |
| Legends Magazine | https://legendsofbasketball.com/media/legends-magazine/ | ✓ 200 |
| All-Access Podcast | https://legendsofbasketball.com/media/all-access-legends-podcast/ | ✓ 200 |
| Photo Gallery | https://legendsofbasketball.com/media/photos/ | ✓ 200 |
| Partners | https://legendsofbasketball.com/partners/ | ✓ 200 |
| Sponsorship Opportunities | https://legendsofbasketball.com/partners/sponsorship-opportunities/ | ✓ 200 |
| Who We Are / About | https://legendsofbasketball.com/who-we-are/ | ✓ 200 |
| Contact | https://legendsofbasketball.com/contact/ | ✓ 200 |
| Events (with www) | https://www.legendsofbasketball.com/events/ | ✓ 200 |

---

## BROKEN URLS - DO NOT USE

### Health & Wellness Programs (All Broken - 404)
- ✗ legendsofbasketball.com/player-programs/health-and-wellness/
- ✗ legendsofbasketball.com/player-programs/health-and-wellness/mental-health/
- ✗ legendsofbasketball.com/player-programs/health-and-wellness/health-insurance/

### Financial Programs (All Broken - 404)
- ✗ legendsofbasketball.com/player-programs/
- ✗ legendsofbasketball.com/player-programs/player-funding/
- ✗ legendsofbasketball.com/player-programs/player-funding/member-grant-program/
- ✗ legendsofbasketball.com/player-programs/player-funding/dave-debusschere-scholarship/
- ✗ legendsofbasketball.com/player-programs/player-funding/earl-lloyd-scholarship/

### Events Sub-pages (Most Broken - 404)
- ✗ legendsofbasketball.com/events/events-calendar/
- ✗ legendsofbasketball.com/events/nba-all-star-weekend/
- ✗ legendsofbasketball.com/events/legends-annual-meeting/
- ✗ legendsofbasketball.com/events/wnba-all-star-weekend/

### Membership Sub-pages (All Broken - 404)
- ✗ legendsofbasketball.com/membership/player-membership/
- ✗ legendsofbasketball.com/membership/legends-locker-room/
- ✗ legendsofbasketball.com/membership/profiles/

### Who We Are Sub-pages (Broken - 404)
- ✗ legendsofbasketball.com/who-we-are/chapters/
- ✗ legendsofbasketball.com/who-we-are/board-of-directors/

### Other Broken
- ✗ legendsofbasketball.com/legends-care/legends-hbcu-scholarship/
- ✗ legendsofbasketball.com/media/legends-lounge-with-trill-withers/
- ✗ legendsofbasketball.com/partners/our-partners/

---

## RECOMMENDED REPLACEMENTS

Since specific program pages don't exist, use these general fallback approaches:

### For Health & Wellness Programs
**REPLACE:** Specific health program URLs  
**WITH:** One of:
1. General contact form: https://legendsofbasketball.com/contact/
2. Who We Are page: https://legendsofbasketball.com/who-we-are/
3. Main homepage: https://legendsofbasketball.com/

### For Financial Support Programs
**REPLACE:** Grant/scholarship specific URLs  
**WITH:** One of:
1. Contact form: https://legendsofbasketball.com/contact/
2. Main membership page: https://legendsofbasketball.com/membership/
3. Note: Consider removing these links if no program page exists

### For Events
**REPLACE:** Specific event URLs  
**WITH:**
- General events page: https://www.legendsofbasketball.com/events/ (note: needs www)

### For Membership Details
**REPLACE:** Specific membership sub-pages  
**WITH:**
- General membership page: https://legendsofbasketball.com/membership/

---

## STRATEGY OPTIONS

### Option 1: Conservative (Recommended)
- Remove all broken links
- Only keep links that are verified to work (13 total)
- Add note: "For more information, visit [LegendsofBasketball.com](https://legendsofbasketball.com) or [contact NBRPA](https://legendsofbasketball.com/contact/)"

### Option 2: Moderate
- Keep general category links (membership, contact, about)
- Replace specific program links with contact form
- Add disclaimer: "For program details, please contact NBRPA"

### Option 3: Aggressive (Not Recommended)
- Keep broken links hoping they'll be added later
- Risk: Poor user experience with 404 errors

---

## IMMEDIATE ACTION NEEDED

1. **Update all files with corrected URLs**
2. **Remove or replace 20 broken links**
3. **Test all remaining links**
4. **Add fallback contact link**

### Files Requiring Updates:
- src/pages/PillarHealthPage.tsx (3 broken links)
- src/pages/PillarFinancePage.tsx (4 broken links)
- src/pages/PillarCommunityPage.tsx (1 broken link)
- src/pages/RetiredPlayerPage.tsx (12 broken links total)
- src/pages/ActivePlayerPage.tsx (4 broken links)
- src/pages/BusinessPartnerPage.tsx (1 broken link)
- src/pages/FamilyMemberPage.tsx (4 broken links)
- src/pages/FivePillarsPage.tsx (2 broken links)

---

## NOTES FOR USER

**I apologize for creating these broken links.** I made assumptions about the site structure based on web search results rather than verifying actual URLs. This is a significant error that needs to be corrected.

**Recommendation:** Let's adopt the Conservative approach - remove broken links and keep only verified working ones, with clear contact information for users seeking program details.


