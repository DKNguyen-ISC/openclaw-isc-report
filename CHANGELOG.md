# Changelog

All notable changes to the ISC OpenClaw Analysis Report are documented here.

## V2.2 — 2026-03-20 (Multi-Dept Day in Life, Claude Upgrade, Honest Numbers)

### Content Fixes (Data Integrity)
- **Hours claim corrected:** 53 hrs/wk → 10–15 hrs/wk (pilot testing); disclaimer added to Kaizen table
- **Cost claim corrected:** $61k+ ROI removed; replaced with "$8–15k/yr (pilot est.)" with testing disclaimer
- **KPI ribbon updated:** ISC Automation shows "Pilot"; ROI cell shows "TBD — Savings pending validation"
- **Kaizen badges:** SC Shortage and PO Matching changed from ✅ Live → ⚙️ Pilot (badge-amber)
- **Pull quote updated:** Reflects honest pilot-phase framing, augmentation not replacement

### New Content
- **Multi-department "Day in the Life":** Replaced 4-item generic timeline with 4 department cards (SC, CS, MPL, PRD), each with 4–6 realistic time-stamped steps, color-coded capability tags, confidence badges, and "Human focus" footer
- **Capability tag system:** 5 color-coded tags (🌐 Browser, ⚡ Shell, 📁 File, 💬 Messaging, ✉️ Email) based on OpenClaw's verified real capabilities
- **Augmentation framing:** Each dept card ends with "Human focus" (gold accent) — positions AI as freeing people for higher-value work, not replacing them

### Claude Section Upgrades
- **Real Claude logo:** Replaced fake "A" letter SVG with official starburst/pinwheel logo, brand color #C15F3C (Crail rust-orange), 48px size
- **Claude vs OpenClaw comparison table:** Side-by-side security, hosting, ISC fit, enterprise support comparison
- **Expanded scenario:** 4-step ISC+Claude scenario expanded to 6 steps (added ERP update and "Done" confirmation)
- **Claude-rec-block:** New "DK's #1 Pick" recommendation block with visual prominence

### Visual Upgrades
- **Hero gold orb:** Enlarged from 500×500 to 700×700px, opacity 0.18→0.28 (much richer gold)
- **Second gold orb:** Added `orb-gold2` (320px, bottom-right of hero, alternate-reverse animation)
- **Gold hairline:** Fixed `body::before` gold gradient at very top of viewport
- **Denser dot grid:** `background-size` 32px→24px for richer texture
- **Enhanced card hover glows:** KPI cells, feature/gap/insight/verdict cards get gold glow on hover
- **Table row hover:** Subtle gold highlight on tbody row hover
- **Maturity dial infographic:** CSS conic-gradient ring showing ISC at L1 of 5 (animates 0→20% on scroll)
- **Roadmap timeline infographic:** Horizontal Q1–Q4 2026 timeline with filled dots and gold connecting lines
- **Reading progress bar:** Thickened 2px→3px, added gold glow shadow

### Git
- Tag: `v2.2`

## V2.1 — 2026-03-20 (Luxury Polish & Content Expansion)

### New Content
- **Claude Spotlight:** Dedicated "Claude Computer Use" subsection in AI Landscape — why Claude is DK's #1 pilot recommendation for ISC's 2027 AI agent evaluation
- **Dark Office Section (#s65):** New full section on the "Dark Office" vision inspired by Kent's interest in Dark Factories — 6-level maturity ladder, ISC's current position, 2028 scenario
- **DK's Personal Note:** Honest editorial perspective from DK at end of Recommendation section
- **Narrative Pull System:** Section hooks (scroll-bait endings), pull quotes (magazine-style), "Kent's Question" thread woven through Sections 0/5/7, chapter dividers

### Visual Upgrades
- **Hero Background:** 3 animated CSS orbs (gold, blue, green) with GPU-composited drift animations
- **Hero H1:** Animated gold-to-white gradient shimmer text (text-shimmer keyframe)
- **Body Texture:** Subtle dot-grid pattern overlay for depth without distraction
- **Enhanced TOC:** `blur(24px) saturate(180%)` glassmorphism, gold glow on active link
- **Shimmer Cards:** Sweep-shimmer animation on `.fc-gold` feature cards
- **Brand Logos:** Inline SVG logos for Anthropic, OpenAI (geometric), Google Gemini (star-burst), Nvidia (text badge), Microsoft (4-square) in AI Landscape table

### New Interactions (JS)
- **KPI Counter Animation:** Currency values count up with `easeOutQuart`; text values use typewriter character-by-character reveal
- **Dark Office Ladder:** Sequential stagger animation on `.level-item` elements (left-slide-in)
- **New card selectors:** `.level-item`, `.doc-card`, `.sf-step`, `.vs-item`, `.decision-item` added to stagger observer

### New CSS Components
- `.hero-orb` / `.orb-gold` / `.orb-blue` / `.orb-green` — animated background orbs
- `.chapter-div` — visual chapter progress dividers
- `.section-hook` — italic forward-pull endings per section
- `.pull-quote` — Playfair Display magazine pull quotes with decorative quote mark
- `.brand-cell` / `.brand-logo` — company logo display in tables
- `.claude-spotlight` / `.cs-header` / `.scenario-flow` / `.sf-step` — Claude section styles
- `.dark-office-intro` / `.dark-office-compare` / `.doc-card` / `.dark-office-ladder` / `.level-item` — maturity ladder styles
- `.vision-scenario` / `.vs-header` / `.vs-timeline` / `.vs-item` — Dark Office day-in-life scenario
- `.dk-note` / `.dk-avatar` / `.dk-header` / `.dk-body` — DK personal note

### Git
- Branch: `feature/v2-polish` → merged to `main`
- Tag: `v2.1`

## V2.0 — 2026-03-19 (Single-File Redesign)

- **Architecture:** Consolidated 8 HTML pages into single scrolling report (`index.html`)
- **Tone:** Pivoted from "Do Not Deploy" to "Monitor, Build Readiness, Integrate When Mature"
- **New Content:** Added "AI Agent Landscape" section (Claude, OpenAI, Gemini, Nvidia)
- **UX:** Added scroll-reveal animations, floating TOC bar, staggered card reveals
- **JS:** Simplified from SPA router (400+ LOC) to IntersectionObserver-based scroll system
- **Design:** Kept Dark Navy & Gold theme, added intra-page animation polish
- **Docs:** Added CHANGELOG.md, Revising_Implementation_Plan_V1.md

## V1.0 — 2026-03-18 (Original Multi-File Report)

- 8-page SPA-style report with fetch-based page transitions
- Deep Navy & Gold CEO-ready design system
- Keyboard navigation (Arrow keys) and scroll-to-next-page
- SPA prefetching for adjacent pages
- Focus: Risk assessment with "Do Not Deploy" recommendation
- Pages: Executive Summary, What is OpenClaw?, 3 Critical Risks, OpenClaw vs Gemini, Can ISC Use It?, Our Alternative, 5W-2H Framework, Recommendation
