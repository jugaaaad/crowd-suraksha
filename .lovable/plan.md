CrowdSuraksha: Real-Time Crowd Monitoring Control Room Dashboard

Overview A professional, dark-themed control room dashboard built in React with simulated real-time data, designed to wow hackathon judges. All 5 Kumbh Mela features will be fully interactive with animated visualizations and realistic data simulation. → Add: Include placeholders (comments in code + static images) for where real backend data (from CSRNet density maps, OpenCV overlays, SQLite queries) will plug in later. Mention in README: "Frontend prototype – backend integration planned via FastAPI/Streamlit."

Design System

* Background: Dark navy (#0A1428) with subtle gradient panels

* Critical alerts: Pulsing red (#FF3B3B) with glow effects

* Warnings: Orange (#FF9500)

* Normal/Safe: Green (#00C853)

* Spiritual accent: Gold (#FFD700) for Kumbh-specific elements

* Typography: Clean monospace for data, sans-serif for labels

* Cards: Glassmorphism with subtle borders and backdrop blur

→ No major change needed — looks great.

Layout Structure Left Sidebar (Fixed)

* CrowdSuraksha logo + "Kumbh Mela Control Room" branding

* Location selector dropdown (10 ghats/locations with mini-map indicator) → Change to:8–10 pre-defined ghats (Sangam Nose, Pontoon Bridge 1–2, Main Ghat Entry, etc.) — add a small static SVG or PNG mini-map of Prayagraj Sangam area (you can generate or find one) to make it feel authentic.

* Global stats cards: Total Count (animated big number), Active Hotspots, Avg Flow Direction (rotating arrow), Overall Status badge

* Next Muhurat countdown timer (live ticking) → Add:Show next 2–3 muhurats (e.g., "Mauni Amavasya in 67 min") from a configurable list in code.

* Quick action buttons: Broadcast PA, Alert Officers, Acknowledge All

Main Area — 5 Tabs Tab 1: Live Monitoring (Default)

* Large simulated video feed area with animated density heatmap overlay (canvas-based), DBSCAN cluster circles, flow arrows, ROI boxes with countdown timers → Add:Overlay text placeholders like "CSRNet Count: XXX (scaling 0.0060)", "Frame Skip: 30", "Optical Flow Avg: XX°" — even if simulated, show these labels to tie back to your real backend.

* Right panel: Real-time scrolling metrics + color-coded alert cards for all 5 features

* Bottom strip: Last 5 alerts with timestamps and action buttons

Tab 2: Advanced Alerts & Warnings

* 5 large feature cards in a grid:

  1. Counter-Flow Conflict — red card with animated opposing arrows

  2. Muhurat Surge Forecaster — orange card with countdown + predicted hotspot list → Add:Show "Threshold auto-lowered by 20%" text on this card.

  3. Family Separation Risk — yellow card with mini heatmap thumbnail → Add:Clickable thumbnail opens modal with "last 10s snapshot" placeholder image.

  4. Panic Wave Propagation — pulsing red card with animated wave visualization (the "wow" feature) → Keep as is — this is your star; make sure animation shows direction arrow + "30–60s Early Warning" countdown.

  5. Ghat Capacity Forecaster — table with live countdowns + reroute suggestions → Add:Include "Predicted Breach: T min" + "Suggested Action: Open Side Gate" text.

* Each card: severity badge, location, confidence %, "Generate PA Script" button (shows Hindi+English text modal), "Send to Officers" button

Tab 3: Analytics & History

* Live recharts line graph (Crowd Count vs Time) with threshold line and colored alert markers → Add:Marker colors per alert type (e.g., red for Panic Wave, orange for Muhurat, etc.)

* Daily separation risk heatmap grid (clickable cells)

* Ghat-wise statistics table with export button

* Summary stats: max count, most conflicted ghat, total alerts today

Tab 4: Configuration

* Sliders: Global threshold, Scaling factor, Frame skip, DBSCAN eps/min_samples → Add:Default values shown (e.g., Scaling factor: 0.0060, Frame skip: 30) to match your real code.

* ROI zone list with enable/disable toggles

* Panchang muhurat time editor (add/edit sacred times)

* Alert sound toggle

Tab 5: System Health

* Camera status indicators (green/red dots)

* FPS counter, DB records count, model load status → Add:Placeholder for "CSRNet Loaded: Yes", "Last Processed Frame: XX ms" — even simulated.

Data Simulation Engine

* A React context providing simulated real-time data that updates every 1-2 seconds

* Crowd counts fluctuate realistically (base + sine wave + random noise)

* Periodic alert triggers for all 5 feature types

* Muhurat countdown based on actual configurable times

* Panic wave simulation: synchronized density spikes propagating across clusters with animated arrows → Add:Make simulation configurable via Config tab (e.g., sliders for noise level, surge probability) so you can demo "normal" vs "critical" scenarios easily.

Alert System

* Global flashing banner across top of all tabs when critical alert fires

* Toast notifications for warnings

* Alert history stored in React state → Add:Also log to localStorage so history persists on refresh — makes demo more realistic.

* PA script generator modal with pre-written Hindi + English announcements → Add:Provide 5–6 template strings in code (e.g., for Conflict: "Attention devotees! Conflict zone detected at Pontoon Bridge 2. Please use side gates and maintain calm." / Hindi version).

Key Animations

* Pulsing glow on critical alerts

* Animated density heatmap using canvas

* Panic wave ripple animation (CSS keyframes)

* Counter-flow opposing arrow animation

* Countdown timers with color transitions (green→yellow→red)

* Number counters with smooth transitions

Pages & Routes

* / — Dashboard with all 5 tabs

* Single-page app with tab navigation

No Backend Required All data is simulated client-side for the hackathon demo. Architecture is designed so a real backend (Supabase or Python API) could be plugged in later by replacing the simulation context. → Change to: No backend required for demo. Designed for easy replacement with Python backend (FastAPI/Streamlit) later — fetch from /api/latest endpoint instead of simulation context.

Summary of Key Changes Needed in Lovable Prompt

1. Add placeholders/comments for real backend labels (scaling 0.0060, frame_skip=30, CSRNet count, etc.)

2. Use real Kumbh ghat names + mini-map image

3. Show multiple muhurats in countdown

4. Tie simulation parameters to config sliders

5. Provide actual PA script templates (Hindi + English)

6. Add confidence % and snapshot modals where missing

7. Emphasize in README/prompt: "Frontend demo only — full integration with Python CSRNet pipeline planned post-hackathon"

 

 

New Feature: Theme Switcher

* Add a toggle switch in the top-right corner of the header (next to logo or in sidebar).

* Default: Dark mode (as current design).

* When toggled to Light mode:

  * Background: Light gray/white (#F8FAFC or #FFFFFF)

  * Text: Dark gray/black

  * Cards: White with subtle shadow instead of glassmorphism

  * Alerts: Keep same vivid colors (red/orange/green) but with softer borders

  * Use React state (useState for theme) + CSS variables (e.g., --bg-primary, --text-primary) or a theme provider.

  * Persist choice in localStorage.

  * Smooth transition (CSS transition on body).

Add Visuals of Historical Pilgrimage Sites

* Include 4–6 high-quality static images as background accents or in a new "Pilgrimage Context" section/modal:

  1. Massive crowd at Kumbh Mela Prayagraj Sangam ghats (aerial view of millions bathing).

  2. Devotees gathering at Kashi Vishwanath Temple entrance in Varanasi (crowded streets/ghats).

  3. Pontoon bridges/paths at Kumbh with dense pilgrim flow.

  4. Optional: Sabarimala or Vaishno Devi queue for comparison (to show general pilgrimage risks).

* Placement ideas:

  * Subtle blurred background on sidebar or dashboard header (low opacity).

  * Dedicated "Context" expander in Sidebar or new Tab 6: "Why Kumbh?" with carousel of images + captions (e.g., "Kumbh Mela 2025: 400M+ pilgrims – world's largest gathering" / "Kashi Vishwanath: Daily dense crowds at sacred site").

  * Use royalty-free/stock placeholders from Getty/Alamy/Shutterstock (or free Unsplash/Pexels equivalents) – code as <img> tags or React components.

* Captions emphasize project relevance: "CrowdSuraksha prevents surges and stampedes at sites like these."

Example Prompt Snippet to Feed Lovable

Add this block to your existing prompt:

"Enhance the dashboard with:

* A theme toggle switch (dark/light) in top-right header. Use React state + CSS variables for smooth switch (default dark, persist in localStorage).

* Integrate 4-6 visuals of historical Indian pilgrimage sites for context:

  * Aerial crowds at Kumbh Mela Prayagraj Sangam ghats.

  * Dense devotees at Kashi Vishwanath Temple Varanasi entrance.

  * Pontoon bridge crossings at Kumbh.

  * General pilgrimage queues (e.g., Sabarimala). Place as subtle blurred backgrounds (header/sidebar) or in a new 'Pilgrimage Context' modal/expander in sidebar with carousel and captions highlighting crowd scale and safety needs. Use placeholder URLs from stock sites (e.g., Getty, Alamy) or free alternatives."  
  
  


 

 "Include these pre-written PA announcement templates in code (Hindi + English pairs):

1. Conflict: English: 'Attention devotees! Conflict zone detected at [Location]. Please use side gates and maintain calm to avoid congestion.' Hindi: 'ध्यान दें भक्तगण! [Location] पर विरोधी प्रवाह क्षेत्र पता चला है। कृपया साइड गेट का उपयोग करें और शांत रहें।'
2. Muhurat Surge: English: 'Muhurat approaching in [T] minutes. Expected surge at [Ghat]. Move calmly and follow instructions.' Hindi: 'मुहूर्त [T] मिनट में आ रहा है। [Ghat] पर भीड़ बढ़ने की संभावना। शांतिपूर्वक आगे बढ़ें।'
3. Panic Wave: English: 'Panic wave propagating towards [Direction]. Evacuate calmly via nearest safe path.' Hindi: 'पैनिक वेव [Direction] की ओर बढ़ रही है। निकटतम सुरक्षित रास्ते से शांतिपूर्वक निकलें।'
4. Separation Risk: English: 'High separation risk at [Ghat]. Families stay together; report to nearest kiosk.' Hindi: '[Ghat] पर अलग होने का उच्च जोखिम। परिवार साथ रहें; निकटतम कियोस्क में रिपोर्ट करें।'
5. Capacity Breach: English: 'Capacity breach predicted at [Ghat] in [T] min. Reroute to alternate path.' Hindi: '[Ghat] पर [T] मिनट में क्षमता उल्लंघन की संभावना। वैकल्पिक रास्ते पर रीडायरेक्ट करें।'
6. General Alert: English: 'High density alert at [Location]. Maintain distance and follow police guidance.' Hindi: '[Location] पर उच्च घनत्व अलर्ट। दूरी बनाए रखें और पुलिस निर्देशों का पालन करें।'"