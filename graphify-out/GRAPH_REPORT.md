# Graph Report - kkkavin.github.io  (2026-10-28)

## Corpus Check
- 29 files · ~27,007 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .css 2, .bak 1)

## Summary
- 208 nodes · 285 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `161a3072`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Package Dependencies & Tooling
- 404 Error & Game Landing
- Smooth Scrolling Engine (Lenis)
- KK Cube Run Arcade Game
- Portfolio UI Interactions & Theme
- Local Development Server
- Featured Portfolio Projects
- Git Automation & Agent Skills
- Arcade Game Widget Embed
- Mobile Portfolio Hero Experience
- Mobile Navigation Test Triage

## God Nodes (most connected - your core abstractions)
1. `@playwright/test` - 17 edges
2. `index.html (Portfolio Homepage)` - 13 edges
3. `update()` - 10 edges
4. `Pinned Projects Track (#projects)` - 8 edges
5. `scripts` - 7 edges
6. `404.html (KK Cube Run Game & Error Page)` - 7 edges
7. `scrollTo()` - 6 edges
8. `updateClassName()` - 6 edges
9. `placeInCell()` - 6 edges
10. `ISSUES.md Test Audit & Remediation Log` - 6 edges

## Surprising Connections (you probably didn't know these)
- `OpenCode Git Staging & Push Command Workflow` --semantically_similar_to--> `Conventional Commit & Upstream Push Workflow`  [INFERRED] [semantically similar]
  .opencode/command/git-push.md → .agents/skills/git-push/SKILL.md
- `OpenCode git-push Command` --semantically_similar_to--> `git-push Skill`  [INFERRED] [semantically similar]
  .opencode/command/git-push.md → .agents/skills/git-push/SKILL.md
- `Portfolio Early Theme Initialization Script` --conceptually_related_to--> `Light Theme Custom Cursor Arrow SVG`  [INFERRED]
  index.html → cursor-arrow-light.svg
- `Portfolio Early Theme Initialization Script` --conceptually_related_to--> `Sunset Theme Custom Cursor Arrow SVG`  [INFERRED]
  index.html → cursor-arrow-sunset.svg
- `Portfolio Early Theme Initialization Script` --semantically_similar_to--> `404 Early Theme Initialization Script`  [INFERRED] [semantically similar]
  index.html → 404.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Mobile Portfolio Landing Experience** — playwright_report_data_9708eea1a4004ee5f99bedddaae55d047ef26d5a_header_navbar, playwright_report_data_9708eea1a4004ee5f99bedddaae55d047ef26d5a_hero_section, playwright_report_data_9708eea1a4004ee5f99bedddaae55d047ef26d5a_cta_buttons [INFERRED 0.85]
- **Tri-State Theme System (Dark, Light, Sunset)** — cursor_arrow_dark, cursor_arrow_light, cursor_arrow_sunset, index_html_theme_init, 404_html_theme_init [INFERRED 0.85]
- **Git Automation and Commit Validation Suite** — agents_skills_git_push_skill, opencode_command_git_push, agents_skills_git_push_skill_conventional_commit, opencode_command_git_push_workflow [INFERRED 0.95]

## Communities (12 total, 1 thin omitted)

### Community 0 - "Package Dependencies & Tooling"
Cohesion: 0.07
Nodes (17): bugs, url, description, devDependencies, @axe-core/playwright@^4.12.1, @playwright/test@^1.62.1, homepage, keywords (+9 more)

### Community 1 - "404 Error & Game Landing"
Cohesion: 0.08
Nodes (33): 404.html (KK Cube Run Game & Error Page), Arcade Game Widget Container (data-widget='arcade'), Dual-Mode 404 / Game Landing Mechanism, KK Cube Run Landing Face (#modeLanding), 404 Not Found Face (#modeNotFound), 404 Early Theme Initialization Script, Dark Theme Custom Cursor Arrow SVG, Light Theme Custom Cursor Arrow SVG (+25 more)

### Community 2 - "Smooth Scrolling Engine (Lenis)"
Cohesion: 0.10
Nodes (21): advance(), cleanUpClassName(), constructor(), destroy(), emit(), isLocked(), isScrolling(), isStopped() (+13 more)

### Community 3 - "KK Cube Run Arcade Game"
Cohesion: 0.12
Nodes (28): audioReady(), blipCrash(), blipJump(), blipStar(), crash(), createAudio(), cssVar(), doJump() (+20 more)

### Community 4 - "Portfolio UI Interactions & Theme"
Cohesion: 0.11
Nodes (19): bgLoop(), clamp(), glyphCells(), glyphPx(), initSplit(), kick(), onScroll(), overlaps() (+11 more)

### Community 5 - "Local Development Server"
Cohesion: 0.20
Nodes (7): fs, http, path, ROOT, send(), server, TYPES

### Community 6 - "Featured Portfolio Projects"
Cohesion: 0.25
Nodes (8): AR Treasure Hunt Vuforia Mobile Game Project, DevPulse Real-Time Monitoring Dashboard Project, DocuMind AI RAG Platform Project, FixRide Vehicle Repair Platform Project, MetaWell VR Healthcare Application Project, AI Student Grievance System Project, WebifyMe Dynamic Portfolio Builder Project, Pinned Projects Track (#projects)

### Community 7 - "Git Automation & Agent Skills"
Cohesion: 0.33
Nodes (7): git-push Skill, Conventional Commit & Upstream Push Workflow, Pre-Push Verification & Health Checks, CLAUDE.md Assistant Instructions, /graphify Trigger & Skill Delegation, OpenCode git-push Command, OpenCode Git Staging & Push Command Workflow

### Community 8 - "Arcade Game Widget Embed"
Cohesion: 0.52
Nodes (6): currentTheme(), footerHTML(), initThemeToggle(), inject(), navHTML(), saveTheme()

### Community 9 - "Mobile Portfolio Hero Experience"
Cohesion: 0.29
Nodes (7): Ambient Grid and Floating Tech Stack Badges, Call to Action Buttons, Mobile Header Navbar, Portfolio Hero Section, Dynamic Role Typewriter, Playwright Mobile Hero UI Screenshot, Social Profile Quick Links

### Community 10 - "Mobile Navigation Test Triage"
Cohesion: 0.29
Nodes (7): scripts, report, serve, test, test:debug, test:headed, test:ui

## Knowledge Gaps
- **25 isolated node(s):** `Arcade Game Widget Container (data-widget='arcade')`, `About Section (#about)`, `Achievements Section (#achievements)`, `Certifications Section (#certifications)`, `Experience Section (#experience)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 87 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html (Portfolio Homepage)` connect `404 Error & Game Landing` to `Featured Portfolio Projects`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `Arcade Game Widget Container (data-widget='arcade')`, `About Section (#about)`, `Achievements Section (#achievements)` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06628787878787878 - nodes in this community are weakly interconnected._
- **Why does `Pinned Projects Track (#projects)` connect `Featured Portfolio Projects` to `404 Error & Game Landing`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `404 Error & Game Landing` be split into smaller, more focused modules?**
  _Cohesion score 0.07765151515151515 - nodes in this community are weakly interconnected._
- **Should `Smooth Scrolling Engine (Lenis)` be split into smaller, more focused modules?**
  _Cohesion score 0.09848484848484848 - nodes in this community are weakly interconnected._
- **Should `KK Cube Run Arcade Game` be split into smaller, more focused modules?**
  _Cohesion score 0.12096774193548387 - nodes in this community are weakly interconnected._