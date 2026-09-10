# Anchangal (Five Stones) — Comprehensive Project & Version Documentation

**Project Title:** Anchangal Five Stones — Traditional South Indian Game Desktop Application  
**Repository:** [github.com/Sudharshini-17/anchangal-five-stones](https://github.com/Sudharshini-17/anchangal-five-stones)  
**Latest Version:** `v1.2.0`  
**Platform:** Windows Desktop Application (`.exe`) & Web Browser  

---

## 1. Executive Summary & Overview

### What is Anchangal (Five Stones)?
**Anchangal** (also known as *Aindhu Kal* in Tamil, or *Five Stones*) is an ancient traditional South Indian physical skill game historically played by children and adults using five small smooth stones or seeds. 

The digital **Anchangal Five Stones Application** modernizes this traditional heritage game into an interactive, high-performance desktop experience. Built with **React** and **Electron**, it faithfully translates the physical mechanics—tossing, picking up, sweeping, and catching—into an engaging digital format accessible on modern computers.

---

## 2. How to Play & Game Progression

The game consists of **8 distinct stages of increasing difficulty**. The objective is to complete all 8 stages with maximum accuracy and the highest score.

### The 8 Stages Breakdown

| Stage | Stage Name | Description & Rule | Target Pickup |
| :---: | :--- | :--- | :---: |
| **1** | **Ones (ONES)** | Toss 1 stone into the air. Pick up 1 ground stone at a time, then catch the falling stone. Repeat for all 4 ground stones. | 1 Stone |
| **2** | **Twos (TWOS)** | Toss 1 stone into the air. Pick up 2 ground stones together in one motion, then catch the falling stone. Repeat for the remaining 2. | 2 Stones |
| **3** | **Threes + One (3 + 1)** | Toss 1 stone. Pick up 3 ground stones at once, catch the falling stone, then pick up the final remaining stone. | 3 Stones |
| **4** | **Sweeping (SWEEP)** | Toss 1 stone into the air. Sweep all 4 ground stones into your hand during a single toss and catch the airborne stone. | 4 Stones |
| **5** | **Placing (PLACE)** | Place 4 stones down sequentially, then sweep them back up in one continuous motion before catching. | 4 Stones |
| **6** | **Exchanging (EXCHANGE)** | Toss 1 stone, quickly swap a held ground stone with a ground stone, and catch the falling stone. | 1 Stone |
| **7** | **Two + Catch (2 + CATCH)** | Toss 2 stones simultaneously into the air, pick up 1 ground stone, and catch both falling stones. | 1 Stone |
| **8** | **Final Challenge (FINAL)** | The final master challenge. Toss the opponent-selected stone, sweep all 4 ground stones, and make the final catch. | 4 Stones |

### Game Controls
- **Toss**: Click any ground stone to throw it into the air.
- **Pickup**: While the stone is airborne, click the required number of ground stones before time runs out.
- **Catch**: Click **`CATCH`** to complete the stage.
- **Stage Action**: Use **`PERFORM STAGE ACTION`** for special maneuvers in Stages 4 through 8.

---

## 3. Cognitive & Developmental Benefits

Playing Anchangal provides significant physical, cognitive, and social benefits:

1. **Enhanced Hand-Eye Coordination & Fine Motor Skills**: Requires precise timing between clicking/picking up ground stones and catching the airborne stone.
2. **Reflex & Reaction Speed Training**: Players must evaluate the flight path and execute ground maneuvers within a split-second window.
3. **Spatial Awareness & Timing**: Teaches spatial judgment, distance estimation, and rapid action planning under time constraints.
4. **Cultural Preservation**: Promotes traditional South Indian heritage and indigenous games in modern digital education and gaming.
5. **Focus & Concentration**: Demands uninterrupted focus across an 8-stage campaign where a single mistake ends the turn.

---

## 4. Software Architecture & Technical Implementation

- **Frontend Framework**: React 18 with modern React Hooks (`useState`, `useEffect`, `useMemo`).
- **Styling & Design System**: Vanilla CSS3 featuring custom gradients, glassmorphism UI overlay, stone physics animation keyframes, and responsive layouts.
- **Desktop Runtime**: Electron 44 engine packaging the web bundle into an offline Windows application.
- **State Management**: Persistence of Best Scores, Audio Preferences, and Multi-Player turns in `localStorage`.
- **Packaging & Build System**: Vite 6 bundler with `electron-builder` producing both Portable Standalone `.exe` binaries and NSIS Setup Installers.

---

## 5. GitHub Repository & Version History

### Repository Link
[https://github.com/Sudharshini-17/anchangal-five-stones](https://github.com/Sudharshini-17/anchangal-five-stones)

---

### Version Evolution & Release Changelog

| Version | Release Date | Summary of Changes & Technical Highlights | GitHub Links |
| :---: | :---: | :--- | :--- |
| **`v1.0.0`** | 2026-09-10 | • Initial release of the desktop application.<br>• Implemented core 8-stage progression loop and physics.<br>• Created single-player & 4-player pass-and-play setup.<br>• Fixed main menu modals for *How to Play*, *Leaderboard*, and *Settings*. | [🏷️ Tag v1.0.0](https://github.com/Sudharshini-17/anchangal-five-stones/releases/tag/v1.0.0) |
| **`v1.1.0`** | 2026-09-10 | • Added `v1.1.0` Version Badge on the main menu.<br>• Enhanced Settings modal with version branding and sound toggle.<br>• Optimized build assets and updated documentation. | [🔀 Diff v1.0.0...v1.1.0](https://github.com/Sudharshini-17/anchangal-five-stones/compare/v1.0.0...v1.1.0) \| [🏷️ Tag v1.1.0](https://github.com/Sudharshini-17/anchangal-five-stones/releases/tag/v1.1.0) |
| **`v1.2.0`** | 2026-09-10 | • **Stage Selector / Practice Mode**: Added starting stage selector on Game Setup screen (choose Stages 1-8 directly).<br>• Updated UI branding to `v1.2.0`.<br>• Enhanced version history and README release links. | [🔀 Diff v1.1.0...v1.2.0](https://github.com/Sudharshini-17/anchangal-five-stones/compare/v1.1.0...v1.2.0) \| [🏷️ Tag v1.2.0](https://github.com/Sudharshini-17/anchangal-five-stones/releases/tag/v1.2.0) |

---

## 6. Summary of Completed GitHub Tasks

1. **Repository Setup**: Initialized Git, configured `.gitignore` to prevent large binary clutter, and linked remote origin.
2. **Commit History**: Pushed all React components, Electron main process files, packaging scripts, and design system.
3. **Version Tagging**: Pushed Git tags `v1.0.0`, `v1.1.0`, and `v1.2.0` to enable full GitHub release tracking and version comparison diffs.
4. **Binary Release Hosting**: Linked the Windows `.exe` setup installer directly via Google Drive integration on the repository README.
