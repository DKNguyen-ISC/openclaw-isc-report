# OpenClaw Report Website — Honest Review & Gemini Improvement Blueprint
**Prepared by: Claude Sonnet 4.6 → Handed to Antigravity Gemini 3.1 Pro**
**Date: March 2026 | Scope: Targeted upgrades — no structural rewrites**

---

## PART 1 — HONEST REVIEW (DK's 6 Points + Additional Findings)

---

### ✅ What's Already Great (Don't Touch These)

- The **Deep Navy + Gold design language** is sophisticated and professional. It reads like a boardroom-grade report, not a generic dashboard.
- **Playfair Display + DM Sans** font pairing is excellent for executive-facing material.
- **Card system** (card, card-gold, card-danger, card-success) is well-structured and consistent.
- **Code blocks** (`code-mac`) are a nice detail that establishes DK's technical credibility.
- **Intersection Observer animations** (`animate-on-scroll`, `is-visible`) are clean.
- **Nav arrows** at the bottom of each page are a good progressive navigation pattern.
- The **content logic** and argumentation flow (OpenClaw → Risks → Alternative → Recommendation) is extremely well-structured for a CEO audience.

---

### POINT 1 — Brightness & Visual Appeal

**Current State:** The `--bg-main: #050d1a` is extremely dark — almost pitch black. Combined with `--bg-surface: #0d1e33` and `--bg-card: #112240`, the entire site feels like a cave. The gold accents are beautiful but get lost in the darkness.

**Specific Issues:**
- The page-hero has no visual differentiator from the body background — it blends in
- Cards feel heavy and sunken rather than elevated
- The gold `--gold: #e8a020` on dark background creates contrast, but the body text `--text-body: #a8b2d8` is quite dim
- Sections feel monotonous — every card looks the same weight

**Recommended Fixes:**
- Lift `--bg-main` to `#06101f` (subtle, not dramatic)
- Lift `--bg-card` to `#142848` and add `--bg-card-hover: #1a3460`
- Add a radial gradient glow behind the hero section: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,160,32,0.08) 0%, transparent 70%)`
- Increase `--text-body` to `#b8c8e8` for better legibility
- Add a subtle top-of-page gold shimmer line: `background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)` at 1–2px height
- On `card-gold`, raise the background slightly: from `rgba(232,160,32,0.04)` to `rgba(232,160,32,0.07)`
- The `--gold-bright: #f5c842` should be used more aggressively on H2 headings to add brightness

---

### POINT 2 — Sidebar Toggle (Floating Problem)

**Current State:** The sidebar is `position: fixed` with no desktop collapse mechanism. It just floats permanently. The hamburger is mobile-only (hidden when `>850px`). On a 1080p monitor, it takes 280px of real estate and cannot be dismissed.

**The Real UX Problem:** The sidebar anchors are OK, but there's no **desktop collapse** affordance. Users reading on a 13-inch laptop especially feel the squeeze.

**Recommended Fix — Collapsible Sidebar:**
Add a collapse toggle button at the bottom of the sidebar brand area (a `‹` chevron). On click:
- Sidebar collapses to `64px` wide (icon-only mode)
- `body` padding-left transitions from `280px` to `64px`
- Icons remain visible; text labels hide with `opacity: 0` / `width: 0`
- Chevron rotates `180deg` to become `›`
- State saved in `localStorage` key `isc_sidebar_collapsed`

CSS additions needed:
```css
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .sidebar-brand span,
.sidebar.collapsed nav a span { opacity: 0; width: 0; overflow: hidden; }
.sidebar.collapsed .brand-sub,
.sidebar.collapsed .brand-meta,
.sidebar.collapsed .sidebar-footer { display: none; }
body.sidebar-collapsed { padding-left: 64px; }
```

JS addition in `shared.js`:
```javascript
const collapseBtn = document.createElement('button');
collapseBtn.className = 'sidebar-collapse-btn';
collapseBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
// Add to .sidebar-brand, toggle classes on click
// Save/restore from localStorage
```

---

### POINT 3 — Page Transition Lag (Root Cause Analysis)

**Current State:** The transition flow is:
1. User clicks nav link → `e.preventDefault()`
2. `body.classList.add('page-exit')` → 300ms CSS animation
3. `setTimeout(280ms)` → `window.location.href = nextPage`
4. Browser makes a full HTTP request, parses new HTML, loads CSS, loads FA icons (CDN), loads fonts
5. `pageEnter` animation plays (500ms)

**Total perceived delay: 280ms (exit) + network round trip + parse time + 500ms (enter) = ~1.0–1.5 seconds minimum.** This is why it feels "lag and delay."

**Root causes:**
- `Font Awesome` CDN and Google Fonts are blocking render on every page load
- No HTML preloading — browsers aren't given hints to prefetch next pages
- `pageEnter` animation is 0.5s — this is long
- No loading indicator between the exit and enter

**Recommended Fixes (in priority order):**

**Fix A — Preload Adjacent Pages (biggest bang, minimal code):**
Add this to each page's `<head>`:
```html
<link rel="prefetch" href="nextPage.html">
<link rel="prefetch" href="prevPage.html">
```
Add dynamically in `shared.js` based on `getPageIndex()`. This tells the browser to silently cache the next page in the background.

**Fix B — Shorten Animations:**
```css
/* In Style.css */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
body { animation: pageEnter 0.25s ease-out both; }  /* was 0.5s */
body.page-exit { animation: pageExit 0.2s ease-in forwards; } /* was 0.3s */
```
And in `shared.js`: change `setTimeout(() => {...}, 180)` (was 280ms).

**Fix C — Add a Progress Bar Transition Indicator:**
A thin gold line that sweeps across the top of the page during navigation:
```css
.page-progress-bar {
  position: fixed; top: 0; left: 0;
  height: 2px; width: 0%; z-index: 9999;
  background: linear-gradient(90deg, var(--gold), var(--gold-bright));
  transition: width 0.3s ease;
}
```
Animate from 0% → 70% on exit click, then jump to 100% + fade on enter.

**Fix D — Preload Font Awesome locally** (advanced — only if hosting allows):
Replace the CDN link with `font-display: swap` or a locally cached version to eliminate the font-render blocking.

---

### POINT 4 — Department Order (CRITICAL CONTENT ERROR)

**This is the most important factual correction in this entire review.**

**Source of Truth — SheetBuilder.gs defines the canonical digitalization order:**
```
1. SC  — Supply Chain          (87% done,  Live)
2. MPL — Master Plan           ( 5% done,  Q2 2026)
3. CS  — Customer Service      ( 2% done,  Q2 2026)
4. PRD — Production            ( 0% done,  Q3 2026)
5. QC  — Quality Control       ( 0% done,  Q3 2026)
6. FIN — Finance / Accounting  ( 0% done,  Q4 2026)
7. HR  — HR / Admin            ( 0% done,  Q4 2026)
```

**What the website currently shows (WRONG):**

| File | Current Order | Missing |
|------|--------------|---------|
| `roadmap.html` — Dept Readiness table | SC → Production → QC → Finance → HR | ❌ MPL and CS are completely absent |
| `analysis.html` — Kaizen Metrics table | SC → SC(PO) → Production → QC → Finance | ❌ MPL and CS absent |
| `comparison.html` line 116 | "Q1 SC → Q2 Production → Q3 QC/Finance → Q4 HR" | ❌ MPL and CS absent |
| `conclusion.html` line 177 | "SC → Production → QC → Finance → HR" | ❌ MPL and CS absent |

**This is a significant misrepresentation** — MPL (Master Plan) is already 5% built and in active Discovery phase. CS has the M1_COSP protocol already running (V7). Both departments are actively being worked on in Q2 2026 and are simply missing from the report entirely.

**Required Updates in Each File:**

**`roadmap.html` — Department Readiness Assessment table:**
Replace 5-row table with 7-row table:
```
Supply Chain    ❌ No   BigQuery + Apps Script        ✅ Live
Master Plan     ❌ No   Scheduling & SC sync engine   🔄 Q2 2026
Customer Svc    ❌ No   M1 CS Status Protocol         🔄 Q2 2026
Production      ❌ No   Completion dashboard           📋 Q3 2026
Quality (QC)    ❌ No   Defect tracking automation    📋 Q3 2026
Finance         ❌ No   Invoice matching automation   📋 Q4 2026
HR / Admin      ⚠️ Personal  Report generation assist 📋 Q4 2026
```

**`analysis.html` — Kaizen Impact Metrics table:**
Add 2 rows after the first SC row:
```
Master Plan (MPL)  Scheduling & SC demand sync  ~6 hrs (est.)  🔄 Q2 2026
Customer Service   M1 CS Protocol / discrepancies ~4 hrs (est.) 🔄 Q2 2026
```
Update the total from "43+ hrs/week" to "53+ hrs/week" (add the estimated hours).

**`comparison.html`:**
Update line: `"Q1 2026 SC (done) → Q2 MPL + CS → Q3 PRD + QC → Q4 Finance + HR"`

**`conclusion.html`:**
Update rollout priority confirmation to: `SC → MPL → CS → PRD → QC → Finance → HR`

---

### POINT 5 — Full UI/UX/Content Inspection

#### 5A. Navigation Label Mismatches
The sidebar nav labels don't align well with the actual page content or filenames:

| File | Current Nav Label | Suggested Label |
|------|------------------|----------------|
| `isc_integration.html` | "The 3 Critical Risks" | ✅ Keep — good |
| `risks_costs.html` | "OpenClaw vs Claude" | ⚠️ File says "risks_costs" but nav says comparison — confusing if someone looks at the URL |
| `roadmap.html` | "Can ISC Use It?" | ✅ Good — direct answer to Kent's question |
| `analysis.html` | "Our Alternative" | ✅ Good |
| `comparison.html` | "5W-2H Framework" | ✅ Good |

**No changes needed here** — the labels are fine as-is for a CEO reader who doesn't look at URLs.

#### 5B. Page Numbering Inconsistency
- `roadmap.html` says "Page 4 of 7" but there are actually **7 content pages** (index = cover, then 7 pages = 8 files total)
- If index is "Page 0" (Cover), then pages 1–7 = features through conclusion → numbering is correct ✅
- But `index.html` has no "Page X of 8" label — it should say "Cover / Executive Summary" which it does via the eyebrow text ✅

**No changes needed.**

#### 5C. Missing Page Progress Indicator
The reader has no visual sense of how far they are in the report. Add a **step indicator** to each page's sidebar (or hero) showing e.g. `● ● ● ○ ○ ○ ○` for position in the 7-page sequence. This is low-effort but high perceived polish.

Implementation: Add to each page's sidebar, just above `sidebar-footer`:
```html
<div class="page-progress-dots">
  <span class="dot active"></span>
  <span class="dot"></span>
  ...
</div>
```
Or alternatively: add a `data-page-index` attribute to `<body>` and generate the dots from `shared.js`.

#### 5D. Hero Section — Missing Visual Differentiation
Every page hero looks identical. The hero on `index.html` (cover) should feel more special — maybe a slightly different background gradient or the ISC brand logo at a larger scale. Easy win: add a unique `hero-accent-color` per page via CSS custom property override in each page's `<style>` tag.

Example for `index.html` (Executive Summary — use gold):
```html
<style>
  .page-hero { --hero-glow: rgba(232,160,32,0.12); }
  .page-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 50% 0%, var(--hero-glow), transparent);
    pointer-events: none;
  }
</style>
```

For `isc_integration.html` (Risks — use red glow), for `analysis.html` (Alternative — use green glow), etc.

#### 5E. Mobile Responsiveness Gap
At ~768px (tablet), the content layout has some issues:
- `.grid-2` collapses correctly, but `.verdict-grid` (3-column on index.html) stacks awkwardly at tablet size
- The `comparison-panel` (comp-col system) needs `flex-wrap: wrap` at <700px
- The `code-mac` blocks overflow horizontally on mobile

These are minor but worth noting in the blueprint.

#### 5F. CTA Box on index.html — Navigation Flow
The index page ends with "Start with Page 1: What is OpenClaw?" and a `Begin Full Report` button — this is excellent UX for a CEO reading the cover. ✅ No change needed.

#### 5G. Comparison.html — 5W2H Framework Accuracy
Line 272 mentions departments in this order: `"SC, Production, QC, Finance, HR, CS, MPL"` — this is random ordering and should reflect the canonical order: `SC, MPL, CS, PRD, QC, Finance, HR`.

#### 5H. Footer Information
`sidebar-footer` just says "ISC Digital Transformation · 2026" — fine, minimal, clean. ✅

---

## PART 2 — COMPREHENSIVE GEMINI BLUEPRINT

---

# BLUEPRINT FOR ANTIGRAVITY GEMINI 3.1 PRO
**Task: Targeted enhancement of OpenClaw_Report website**
**Rule: Do NOT restructure pages. Do NOT change the content narrative. Do NOT rename files. Make surgical edits only.**

---

## CONTEXT & ORIENTATION

You are working on a multi-page static HTML/CSS/JS report website called **ISC OpenClaw Analysis Report**, built for CEO Kent at ISC Stationery (Vietnam). The site consists of:

```
OpenClaw_Report/
├── index.html          ← Cover / Executive Summary
├── features.html       ← What is OpenClaw?
├── isc_integration.html← The 3 Critical Risks
├── risks_costs.html    ← OpenClaw vs Claude
├── roadmap.html        ← Can ISC Use It?
├── analysis.html       ← Our Alternative (ISC's roadmap)
├── comparison.html     ← 5W-2H Framework
├── conclusion.html     ← Final Recommendation
├── Style.css           ← Single shared stylesheet
└── assets/shared.js    ← Shared JS (nav, transitions, mobile)
```

The site uses: **Deep Navy + Gold** color scheme, Playfair Display + DM Sans fonts, Font Awesome 6.5 icons, no build tools, pure HTML/CSS/JS.

**DO NOT:**
- Change the content/narrative/argument of any page
- Rename any HTML files
- Restructure page layouts fundamentally
- Add new pages
- Add external libraries (jQuery, Alpine, etc.)

---

## TASK 1 — CSS Brightness Upgrade
**File: `Style.css`**
**Priority: HIGH**

Make these exact variable and style changes in the `:root` block and specific rules:

### 1.1 — Lift Background Values
```css
/* OLD → NEW */
--bg-main: #050d1a;       → #06101f
--bg-surface: #0d1e33;    → #0e2038
--bg-card: #112240;       → #142848
--bg-card-hover: #172f52; → #1a3460
--text-body: #a8b2d8;     → #b8c8e8
--gold-glow: rgba(232, 160, 32, 0.15); → rgba(232, 160, 32, 0.18)
```

### 1.2 — Hero Glow Enhancement
After the `.page-hero` rule, add:
```css
.page-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(232,160,32,0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.page-hero > * { position: relative; z-index: 1; }
```

### 1.3 — Top-of-page Shimmer Line
After the `.sidebar` block, add:
```css
.main-content::before {
  content: '';
  display: block;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(232,160,32,0.4) 40%, rgba(245,200,66,0.6) 50%, rgba(232,160,32,0.4) 60%, transparent 100%);
  margin-bottom: 0;
}
```

### 1.4 — Section Header Brightness
Find `.section-header h2` (or add it) and ensure it uses `--text-heading` not `--text-main`:
```css
.section-header h2 {
  color: var(--text-heading);
  font-weight: 700;
}
```

### 1.5 — Card Elevation Enhancement
Find `.card` rule and add/modify:
```css
.card {
  /* existing styles... */
  box-shadow: 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
}
.card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(232,160,32,0.05);
}
```

---

## TASK 2 — Collapsible Desktop Sidebar Toggle
**Files: `Style.css` + `assets/shared.js`**
**Priority: HIGH**

### 2.1 — Add CSS for Collapsed State
Append to `Style.css`:
```css
/* =============================================
   SIDEBAR COLLAPSE TOGGLE
   ============================================= */

.sidebar-collapse-btn {
  position: absolute;
  bottom: 1rem;
  right: -14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  z-index: 101;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.sidebar-collapse-btn:hover {
  background: var(--gold-glow);
  color: var(--gold-bright);
}

.sidebar.collapsed {
  width: 64px;
}
.sidebar.collapsed .brand-sub,
.sidebar.collapsed .brand-meta,
.sidebar.collapsed .sidebar-footer {
  display: none;
}
.sidebar.collapsed .sidebar-brand {
  padding: 1.5rem 0;
  display: flex;
  justify-content: center;
}
.sidebar.collapsed .brand-logo {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
}
.sidebar.collapsed nav a span,
.sidebar.collapsed nav a {
  justify-content: center;
}
.sidebar.collapsed nav a .nav-label {
  display: none;
}
.sidebar.collapsed nav a {
  padding: 0.75rem;
  justify-content: center;
}
.sidebar.collapsed nav a i {
  width: auto;
  font-size: 1rem;
  opacity: 0.8;
}
.sidebar.collapsed .sidebar-collapse-btn i {
  transform: rotate(180deg);
}
body.sidebar-collapsed {
  padding-left: 64px;
}
```

### 2.2 — Wrap nav link text in `<span class="nav-label">`
In ALL 8 HTML files, each `<nav>` link's text node should be wrapped:
```html
<!-- BEFORE -->
<a href="index.html" class="active"><i class="fa-solid fa-file-lines"></i> Executive Summary</a>

<!-- AFTER -->
<a href="index.html" class="active"><i class="fa-solid fa-file-lines"></i><span class="nav-label"> Executive Summary</span></a>
```
Apply to all 8 nav links in all 8 HTML files (total: 64 link edits, but they are all the same pattern).

### 2.3 — Add JS for Collapse Toggle in `shared.js`
Add this block INSIDE the `DOMContentLoaded` listener, after the sidebar setup code:
```javascript
// Desktop Sidebar Collapse Toggle
function initSidebarCollapse() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Restore saved state
  if (localStorage.getItem('isc_sidebar_collapsed') === 'true') {
    sidebar.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }

  // Create toggle button
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'sidebar-collapse-btn';
  collapseBtn.setAttribute('aria-label', 'Toggle sidebar');
  collapseBtn.title = 'Collapse sidebar';
  collapseBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  sidebar.style.position = 'fixed'; // ensure relative for button
  sidebar.appendChild(collapseBtn);

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    localStorage.setItem('isc_sidebar_collapsed', isCollapsed);
  });
}

// Only run on desktop
if (window.innerWidth >= 850) {
  initSidebarCollapse();
}
```

---

## TASK 3 — Faster Page Transitions
**Files: `Style.css` + `assets/shared.js`**
**Priority: HIGH**

### 3.1 — Shorten Animation Durations in CSS
```css
/* Find and update these in Style.css */

/* body pageEnter: change from 0.5s to 0.22s */
body {
  animation: pageEnter 0.22s ease-out both;
}

/* pageExit: change from 0.3s to 0.18s */
body.page-exit {
  animation: pageExit 0.18s ease-in forwards;
}

/* pageEnter keyframe: reduce translateY */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 3.2 — Add Progress Bar CSS
```css
/* Add to Style.css */
#page-transition-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--gold), var(--gold-bright), var(--gold));
  z-index: 9999;
  transition: width 0.3s ease, opacity 0.2s ease;
  pointer-events: none;
}
```

### 3.3 — Update shared.js Transition Logic
Replace the `navigateTo` function and the sidebar click listener with this improved version:
```javascript
// Create progress bar element
const progressBar = document.createElement('div');
progressBar.id = 'page-transition-bar';
document.body.appendChild(progressBar);

function showProgress() {
  progressBar.style.width = '70%';
  progressBar.style.opacity = '1';
}
function completeProgress() {
  progressBar.style.width = '100%';
  setTimeout(() => { progressBar.style.opacity = '0'; progressBar.style.width = '0%'; }, 200);
}

// On page enter: complete the bar
window.addEventListener('load', completeProgress);

function navigateTo(direction) {
  const currentIndex = getPageIndex();
  if (currentIndex === -1) return;
  let nextIndex = currentIndex + direction;
  if (nextIndex >= 0 && nextIndex < pages.length) {
    showProgress();
    document.body.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = pages[nextIndex];
    }, 180); // Reduced from 280ms
  }
}

// Intercept sidebar link clicks — apply exit animation + progress bar
document.querySelectorAll('.sidebar nav a, .nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      showProgress();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 180);
    }
  });
});
```

### 3.4 — Prefetch Adjacent Pages
Add this function to `shared.js`, called after `getPageIndex()` is available:
```javascript
// Prefetch adjacent pages for faster navigation
function prefetchAdjacentPages() {
  const currentIndex = getPageIndex();
  if (currentIndex === -1) return;

  const toPrefetch = [];
  if (currentIndex + 1 < pages.length) toPrefetch.push(pages[currentIndex + 1]);
  if (currentIndex - 1 >= 0) toPrefetch.push(pages[currentIndex - 1]);

  toPrefetch.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });
}
prefetchAdjacentPages();
```

---

## TASK 4 — Fix Department Order (CRITICAL DATA CORRECTION)
**Files: `roadmap.html`, `analysis.html`, `comparison.html`, `conclusion.html`**
**Priority: CRITICAL — This is a factual error affecting executive credibility**

**Canonical department order from SheetBuilder.gs:**
```
1. SC  — Supply Chain      87%   ✅ Live
2. MPL — Master Plan        5%   🔄 Q2 2026
3. CS  — Customer Service   2%   🔄 Q2 2026
4. PRD — Production         0%   📋 Q3 2026
5. QC  — Quality Control    0%   📋 Q3 2026
6. FIN — Finance            0%   📋 Q4 2026
7. HR  — HR / Admin         0%   📋 Q4 2026
```

### 4.1 — Fix `roadmap.html` — Department Readiness Assessment Table

**FIND this tbody block** (the 6-row table):
```html
<tr>
  <td><strong>Supply Chain</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>BigQuery + Apps Script automation</td>
  <td><span class="tag tag-green">✅ Live</span></td>
</tr>
<tr>
  <td><strong>Production</strong></td>
  ...
```

**REPLACE with this 7-row tbody:**
```html
<tr>
  <td><strong>Supply Chain (SC)</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>BigQuery + Apps Script automation</td>
  <td><span class="tag tag-green">✅ Live</span></td>
</tr>
<tr>
  <td><strong>Master Plan (MPL)</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>Scheduling engine & SC demand sync</td>
  <td><span class="tag tag-gold">🔄 Q2 2026</span></td>
</tr>
<tr>
  <td><strong>Customer Service (CS)</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>M1 CS Status Protocol — full cycle</td>
  <td><span class="tag tag-gold">🔄 Q2 2026</span></td>
</tr>
<tr>
  <td><strong>Production (PRD)</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>Completion dashboard & SC/MPL sync</td>
  <td><span class="tag tag-outline">📋 Q3 2026</span></td>
</tr>
<tr>
  <td><strong>Quality Control (QC)</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>Defect pattern tracking automation</td>
  <td><span class="tag tag-outline">📋 Q3 2026</span></td>
</tr>
<tr>
  <td><strong>Finance / Accounting</strong></td>
  <td><span class="text-danger">❌ No</span></td>
  <td>Invoice matching automation</td>
  <td><span class="tag tag-outline">📋 Q4 2026</span></td>
</tr>
<tr>
  <td><strong>HR / Admin</strong></td>
  <td><span class="text-warning">⚠️ Personal only</span></td>
  <td>Report generation assistance</td>
  <td><span class="tag tag-outline">📋 Q4 2026</span></td>
</tr>
```

### 4.2 — Fix `analysis.html` — Kaizen Impact Metrics Table

**FIND the tbody row for Production** (right after the SC PO row):
```html
<tr>
  <td><strong>Production</strong></td>
  <td>Scheduling dashboard</td>
  <td>~8 hrs (est.)</td>
  <td><span class="tag tag-gold">🔄 Q2 2026</span></td>
</tr>
```

**INSERT BEFORE this Production row** (two new rows for MPL and CS):
```html
<tr>
  <td><strong>Master Plan (MPL)</strong></td>
  <td>Scheduling & SC demand sync</td>
  <td>~6 hrs (est.)</td>
  <td><span class="tag tag-gold">🔄 Q2 2026</span></td>
</tr>
<tr>
  <td><strong>Customer Service (CS)</strong></td>
  <td>M1 CS Protocol / discrepancy alerts</td>
  <td>~4 hrs (est.)</td>
  <td><span class="tag tag-gold">🔄 Q2 2026</span></td>
</tr>
```

**Also update the total row** — change "43+ hrs/week" to "53+ hrs/week".

### 4.3 — Fix `comparison.html`

**FIND:**
```
Q1 2026 SC (done) → Q2 Production → Q3 QC/Finance → Q4 HR
```

**REPLACE with:**
```
Q1 2026 SC (done) → Q2 MPL + CS → Q3 PRD + QC → Q4 Finance + HR
```

Also find the mentions of `"SC, Production, QC, Finance, HR, CS, MPL"` (random order) and replace with:
`"SC, MPL, CS, PRD, QC, Finance, HR"` — the canonical order.

### 4.4 — Fix `conclusion.html`

**FIND:**
```
Confirm department rollout priority order (SC → Production → QC → Finance → HR)
```

**REPLACE with:**
```
Confirm department rollout priority order (SC → MPL → CS → PRD → QC → Finance → HR)
```

---

## TASK 5 — Additional Polish (Lower Priority)

### 5.1 — Page Progress Dots in Sidebar
Add to each HTML file's sidebar, just above `<div class="sidebar-footer">`:
```html
<div class="sidebar-progress-dots">
  <span class="pdot pdot-0"></span>
  <span class="pdot pdot-1"></span>
  <span class="pdot pdot-2"></span>
  <span class="pdot pdot-3"></span>
  <span class="pdot pdot-4"></span>
  <span class="pdot pdot-5"></span>
  <span class="pdot pdot-6"></span>
  <span class="pdot pdot-7"></span>
</div>
```

For each page, mark the corresponding dot as active by adding class `active` to the appropriate `.pdot` element.

Add to `Style.css`:
```css
.sidebar-progress-dots {
  display: flex;
  gap: 5px;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-light);
}
.pdot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(100,130,200,0.2);
  transition: var(--transition);
}
.pdot.active {
  background: var(--gold);
  box-shadow: 0 0 6px var(--gold-glow);
}
```

### 5.2 — Hero Color Accent per Page (Optional but Nice)
Add a subtle inline `<style>` block to each page to give each hero a unique tint:

- `index.html` → gold glow (already default)
- `isc_integration.html` → `rgba(255,107,107,0.06)` (red — risks)
- `analysis.html` → `rgba(100,255,218,0.05)` (green — good news)
- `conclusion.html` → `rgba(232,160,32,0.09)` (gold — decision)

### 5.3 — Fix comparison.html Department Reference Order
Find the line mentioning departments in random order and update to canonical SC → MPL → CS → PRD → QC → Finance → HR.

---

## IMPLEMENTATION ORDER FOR GEMINI

Execute in this sequence to minimize risk:

```
Phase 1 (CSS only — safe, visual):
  → TASK 1: CSS Brightness (Style.css only)
  → TASK 5.1: Sidebar progress dots CSS

Phase 2 (JS — test each page after):
  → TASK 3.1: Shorter animation durations (Style.css)
  → TASK 3.2: Progress bar CSS (Style.css)
  → TASK 3.3: Update shared.js transition logic
  → TASK 3.4: Prefetch function in shared.js

Phase 3 (HTML — 8 files, most work):
  → TASK 2.2: Wrap nav labels in all 8 files
  → TASK 4.1: Fix roadmap.html dept table
  → TASK 4.2: Fix analysis.html kaizen table
  → TASK 4.3: Fix comparison.html timeline text
  → TASK 4.4: Fix conclusion.html rollout order
  → TASK 5.1: Add progress dots to all 8 sidebars

Phase 4 (JS collapse logic — do last):
  → TASK 2.1: Sidebar collapse CSS
  → TASK 2.3: Sidebar collapse JS in shared.js
```

---

## QUALITY CHECKLIST FOR GEMINI (Run Before Delivering)

- [ ] Open `index.html` in browser — does the sidebar collapse button appear on the right edge of sidebar?
- [ ] Click collapse — does sidebar shrink to 64px with icons only? Does body padding adjust?
- [ ] Refresh page — does collapsed state persist (localStorage)?
- [ ] Click a nav link — is the transition noticeably faster? (target: <400ms total)
- [ ] Does the gold progress bar appear at the top during navigation?
- [ ] Open `roadmap.html` — does the table show 7 rows including MPL and CS?
- [ ] Open `analysis.html` — does the Kaizen table include MPL and CS rows?
- [ ] Check `conclusion.html` — does rollout order read "SC → MPL → CS → PRD → QC → Finance → HR"?
- [ ] Resize to 768px — do nav links disappear properly and hamburger appear?
- [ ] Check hero sections — are they visibly brighter/more appealing than the original dark?
- [ ] No new console errors?

---

*End of Blueprint*
*Document prepared by Claude Sonnet 4.6 based on full code review of OpenClaw_Report.zip, Code.gs, and SheetBuilder.gs*
*This blueprint is a surgical improvement guide — not a rewrite instruction.*