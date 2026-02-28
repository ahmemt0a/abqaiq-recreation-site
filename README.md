
# Abqaiq Recreation — Static Site Starter

A responsive, accessible static site with:
- Full-screen hero landing page with dark overlay and animated down arrow
- Map-based Areas hub (SVG) with hover + click interactions
- One page per Area with filterable facility cards (data-driven)
- Facility detail template powered by `data/facilities.json`
- Top navigation + footer per your requested sitemap

## Quick Start
1. Serve locally (any static server), e.g. with Python:
   ```bash
   python3 -m http.server 8080 --directory .
   ```
   then visit http://localhost:8080/index.html

2. Deploy (pick one):
   - **Vercel**: Import this folder as a project (Framework: Other). Build command: none. Output: `/`.
   - **Netlify**: Drag & drop the folder into Netlify. Build command: none. Publish directory: `/`.
   - **GitHub Pages**: Create a repo, push files, enable Pages → deploy from `main` root.

## Add Real Content
- Replace images in `/images` with real photos (keep filenames or update CSS/HTML).
- Add more facilities to `data/facilities.json`. Fields used:
  ```json
  {
    "id": "unique-slug",
    "area": "main-camp | al-farhah | al-saadah | oasis | beaches",
    "name": "...",
    "category": "Fitness | Sports | Parks | Aquatics | Entertainment | Nature",
    "status": "Operating | Closed | Seasonal",
    "operating_days": "e.g., 7 days",
    "open_time": "e.g., 7:00 AM",
    "close_time": "e.g., 10:30 PM",
    "purpose": "...",
    "purpose_category": "...",
    "description": "...",
    "address": "...",
    "lat": "25.9...",
    "lng": "49.6...",
    "photo": "/images/...",
    "photos": ["/images/...", "..."],
    "amenities": ["..."],
    "phone": "+966 ...",
    "email": "...",
    "booking": "https://..."
  }
  ```

- The **Area pages** automatically render cards for facilities with the matching `area` value.
- The **Facility page** reads `?id=your-facility-id` and fills all sections.

## Notes
- The map is a simplified SVG placeholder. You can replace it with a custom SVG or a static map image with absolutely positioned buttons.
- The Google Map embed uses a simple `iframe` (no API key). If you need dynamic Maps JS API later, you can add it safely.
- Accessibility: semantic headings, focusable nav, alt text, and color contrast considered.

## Multilingual (Optional)
- For Arabic/English, add an `ar` folder and duplicate pages with `dir="rtl"` and localized text, or integrate a lightweight i18n script.
