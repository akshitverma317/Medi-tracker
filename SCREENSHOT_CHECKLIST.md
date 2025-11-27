# Screenshot & Recording Checklist

Quick reference for capturing all required media for the blog post.

---

## 📸 Screenshots Needed (8 total)

### ✅ Checklist

- [ ] 1. kiro-generating-code.png
- [ ] 2. kiro-project-structure.png
- [ ] 3. dashboard-mobile-desktop.png
- [ ] 4. smart-alerts-panel.png
- [ ] 5. inventory-predictions.png
- [ ] 6. form-validation.png
- [ ] 7. lighthouse-report.png
- [ ] 8. undo-toast.png

---

## 📷 Screenshot Details

### 1. Kiro Generating Code
**File:** `kiro-generating-code.png`

**What to capture:**
- Kiro interface with prompt
- Generated AlertService.js code
- Show the quality of generated code

**How:**
- Open Kiro
- Type prompt: "Create a drug interaction detection service"
- Capture the generated code
- Highlight key parts

**Tips:**
- Use high resolution
- Show both prompt and result
- Make sure code is readable

---

### 2. Kiro Project Structure
**File:** `kiro-project-structure.png`

**What to capture:**
- Kiro scaffolding the project
- File tree being created
- Multiple files generated at once

**How:**
- Show Kiro creating project structure
- Capture file explorer with new files
- Highlight the organization

**Tips:**
- Show the speed of generation
- Capture multiple files at once
- Show proper folder structure

---

### 3. Dashboard (Mobile + Desktop)
**File:** `dashboard-mobile-desktop.png`

**What to capture:**
- Side-by-side comparison
- Mobile view (375px width)
- Desktop view (1440px width)

**How:**
```bash
# Run the app
npm run dev

# Open in browser
# Use Chrome DevTools (F12)
# Toggle device toolbar (Cmd+Shift+M)

# Take two screenshots:
# 1. Mobile: iPhone 12 Pro (390x844)
# 2. Desktop: Full width

# Combine in image editor
```

**Tips:**
- Show same content on both
- Highlight responsive design
- Include alerts and doses

---

### 4. Smart Alerts Panel
**File:** `smart-alerts-panel.png`

**What to capture:**
- Drug interaction warning
- Critical allergy alert
- Low stock alert

**How:**
```bash
# 1. Add patient with allergies
# 2. Add medicine that triggers interaction
# 3. Capture the alerts panel
```

**Tips:**
- Show critical severity
- Include multiple alert types
- Make warnings visible

---

### 5. Inventory Predictions
**File:** `inventory-predictions.png`

**What to capture:**
- Inventory page
- Refill date calculations
- Low stock warnings
- Days remaining

**How:**
```bash
# Navigate to /inventory
# Show medicines with:
# - Low stock (red)
# - Medium stock (yellow)
# - Good stock (green)
```

**Tips:**
- Show the refill date calculation
- Include stock levels
- Show color coding

---

### 6. Form Validation
**File:** `form-validation.png`

**What to capture:**
- Medicine form with errors
- Multiple validation messages
- Helpful error text

**How:**
```bash
# Navigate to /medicines/add
# Try to submit empty form
# Capture validation errors
```

**Tips:**
- Show multiple error types
- Highlight helpful messages
- Show real-time validation

---

### 7. Lighthouse Report
**File:** `lighthouse-report.png`

**What to capture:**
- Full Lighthouse audit
- 95/100 performance score
- All metrics (FCP, LCP, TBT, CLS)

**How:**
```bash
# 1. Build production version
npm run build
npm run preview

# 2. Open Chrome DevTools
# 3. Go to Lighthouse tab
# 4. Run audit (Desktop, Navigation)
# 5. Capture results
```

**Tips:**
- Use production build
- Show all 4 categories
- Highlight 95 performance score

---

### 8. Undo Toast
**File:** `undo-toast.png`

**What to capture:**
- Toast notification
- "Undo" button
- Success message

**How:**
```bash
# 1. Mark a dose as taken
# 2. Capture the toast that appears
# 3. Show "Undo" button
```

**Tips:**
- Capture within 10 seconds
- Show the undo button clearly
- Include success icon

---

## 🎥 Recordings Needed (3 total)

### ✅ Checklist

- [ ] 1. kiro-feature-demo.mp4 (2-3 min)
- [ ] 2. app-walkthrough.mp4 (1-2 min)
- [ ] 3. performance-demo.mp4 (30 sec)

---

## 🎬 Recording Details

### 1. Kiro Feature Demo
**File:** `kiro-feature-demo.mp4`  
**Length:** 2-3 minutes

**Script:**
```
0:00 - Show empty file or component
0:15 - Type prompt to Kiro
0:30 - Show Kiro generating code
1:30 - Run the app
2:00 - Demonstrate the feature
2:30 - Highlight code quality
```

**Prompt to use:**
```
"Add inventory tracking with automatic refill date 
predictions based on daily consumption"
```

**Tools:**
- Mac: QuickTime (Cmd+Shift+5)
- Windows: Xbox Game Bar (Win+G)
- Linux: SimpleScreenRecorder
- Cross-platform: OBS Studio

**Tips:**
- Record at 1080p
- Use clear audio if narrating
- Keep cursor movements smooth
- Edit out long pauses

---

### 2. App Walkthrough
**File:** `app-walkthrough.mp4`  
**Length:** 1-2 minutes

**Script:**
```
0:00 - Login screen (use demo credentials)
0:10 - Dashboard overview
0:20 - Add a patient
0:35 - Add a medicine
0:50 - Show smart alert triggering
1:05 - Mark dose as taken
1:20 - Show inventory prediction
1:35 - Quick stats overview
```

**Demo Credentials:**
```
Username: admin
Password: admin123
```

**Tips:**
- Smooth transitions
- Show key features
- Highlight smart alerts
- End with impact statement

---

### 3. Performance Demo
**File:** `performance-demo.mp4`  
**Length:** 30 seconds

**Script:**
```
0:00 - Open Chrome DevTools
0:05 - Navigate to Lighthouse tab
0:10 - Click "Analyze page load"
0:15 - Show audit running
0:20 - Results appear (95/100)
0:25 - Highlight key metrics
```

**Tips:**
- Use production build
- Clear cache first
- Show all metrics
- Zoom in on score

---

## 🛠️ Tools & Setup

### Screenshot Tools

**Mac:**
- Built-in: Cmd+Shift+4 (area), Cmd+Shift+3 (full)
- CleanShot X (paid, better features)

**Windows:**
- Built-in: Win+Shift+S
- Snipping Tool
- ShareX (free, powerful)

**Linux:**
- Flameshot
- Shutter
- GNOME Screenshot

### Recording Tools

**Free:**
- OBS Studio (all platforms)
- QuickTime (Mac)
- Xbox Game Bar (Windows)
- SimpleScreenRecorder (Linux)

**Paid:**
- Camtasia
- ScreenFlow (Mac)
- Snagit

### Editing Tools

**Screenshots:**
- Preview (Mac)
- Paint.NET (Windows)
- GIMP (all platforms)
- Photopea (web-based)

**Videos:**
- iMovie (Mac)
- DaVinci Resolve (free, all platforms)
- Shotcut (free, all platforms)
- Kapwing (web-based)

---

## 📐 Technical Specs

### Screenshots
- **Format:** PNG
- **Resolution:** 1920x1080 or higher
- **File size:** <2MB each
- **Color:** RGB
- **Compression:** Moderate (quality 80-90)

### Videos
- **Format:** MP4 (H.264)
- **Resolution:** 1920x1080
- **Frame rate:** 30fps
- **Bitrate:** 5-10 Mbps
- **Audio:** AAC, 128kbps (if narrating)

---

## 📁 File Organization

Create this structure:

```
medicine-tracker/
├── blog-images/
│   ├── kiro-generating-code.png
│   ├── kiro-project-structure.png
│   ├── dashboard-mobile-desktop.png
│   ├── smart-alerts-panel.png
│   ├── inventory-predictions.png
│   ├── form-validation.png
│   ├── lighthouse-report.png
│   └── undo-toast.png
├── blog-videos/
│   ├── kiro-feature-demo.mp4
│   ├── app-walkthrough.mp4
│   └── performance-demo.mp4
└── BLOG_POST_AWS_BUILDER_CENTER.md
```

---

## ✨ Quality Checklist

### Before Taking Screenshots

- [ ] Clean browser (no extensions visible)
- [ ] Hide bookmarks bar
- [ ] Close unnecessary tabs
- [ ] Use consistent browser window size
- [ ] Clear console errors
- [ ] Use demo data (not real patient info)

### Before Recording Videos

- [ ] Close unnecessary applications
- [ ] Disable notifications
- [ ] Use clean desktop background
- [ ] Test audio levels (if narrating)
- [ ] Practice the flow once
- [ ] Have script ready

### After Capturing

- [ ] Check image quality
- [ ] Verify text is readable
- [ ] Crop unnecessary parts
- [ ] Add annotations if needed
- [ ] Compress files appropriately
- [ ] Test in blog post

---

## 🎯 Quick Start

### 30-Minute Sprint

If you want to do this quickly:

**Minutes 0-10: Screenshots**
1. Run app: `npm run dev`
2. Take 6 app screenshots (skip Kiro ones for now)
3. Save to blog-images/

**Minutes 10-20: Lighthouse**
1. Build: `npm run build && npm run preview`
2. Run Lighthouse audit
3. Screenshot results

**Minutes 20-30: Quick Video**
1. Record 1-minute app walkthrough
2. Save to blog-videos/

**Done!** You can add Kiro screenshots later.

---

## 💡 Pro Tips

### Screenshots
1. **Use high DPI** - Retina/4K displays look better
2. **Consistent styling** - Same browser, same theme
3. **Annotate sparingly** - Only highlight key points
4. **Show real data** - But anonymize patient info
5. **Good lighting** - If photographing screens

### Videos
1. **Script it** - Know what you'll say/do
2. **Practice once** - Smooth execution
3. **Edit ruthlessly** - Cut dead time
4. **Add captions** - Accessibility matters
5. **Background music** - Optional, keep subtle

### General
1. **Batch similar tasks** - All screenshots at once
2. **Use templates** - Consistent sizing/framing
3. **Version control** - Keep originals
4. **Get feedback** - Show someone first
5. **Optimize files** - Balance quality and size

---

## 🚀 Ready to Start?

1. **Create folders:**
   ```bash
   mkdir -p medicine-tracker/blog-images
   mkdir -p medicine-tracker/blog-videos
   ```

2. **Run the app:**
   ```bash
   cd medicine-tracker
   npm run dev
   ```

3. **Start capturing!**

---

## ✅ Completion Checklist

When done, verify:

- [ ] All 8 screenshots captured
- [ ] All 3 videos recorded
- [ ] Files properly named
- [ ] Files in correct folders
- [ ] Quality checked
- [ ] File sizes reasonable
- [ ] Inserted into blog post
- [ ] Captions added
- [ ] Links working

---

**Estimated Time:**
- Screenshots: 30-45 minutes
- Videos: 45-60 minutes
- Editing: 15-30 minutes
- **Total: 1.5-2 hours**

You've got this! 🎉

