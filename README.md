# ☕ Coffee or Fired 💻

"Office Overload" is an individual, browser-based strategic survival game built from scratch using **Vanilla JavaScript, HTML5, and CSS3**. The player must navigate an intense office environment, manage their energy levels, and complete coding tasks while avoiding distractions! 🚀

---

## 📋 Table of Contents
* [🎮 Game Concept](#1-game-concept)
* [👥 Entities](#2-entities)
* [🎨 Game Sketch](#3-game-sketch)
* [🕹 How to Play](#4-how-to-play)
* [🛠 Tech Decisions](#5-tech-decisions)
* [📖 AI Diary](#6-ai-diary)
* [🌐 Live Demo](#7-live-demo)
* [🐛 Known Bugs & Improvements](#8-known-bugs--improvements)

---

## 1. 🎮 Game Concept
**Office Overload** is a top-down survival challenge where the player must balance productivity with caffeine intake. The game features a dynamic "Coffee Bar" system, AI-controlled enemy pathing, and strategic decision-making. As you progress, you climb the corporate ladder from Intern to Chief Architect! 🚀

## 2. 👥 Entities
* **Player 👩‍💻:** The developer, moved via `W-A-S-D`. Appearance changes based on career level (Intern, Junior, Senior, etc.).
* **Boss 👔:** An aggressive enemy with autonomous patrol patterns. Touching them triggers **Game Over**!
* **Coffee Machine ☕:** A static utility. Overlapping with this entity refills the `Coffee Bar`.
* **Laptop 💻:** The central objective. Reach it with energy to "write code" and score points, and level up your career!
* **Power-Ups ⚡/🛡️:** Temporary boosts for speed or invincibility.

## 3. 🎨 Game Sketch
![Game Sketch](Coffee%20vs%20Ofice%20game.png)

## 4. 🕹 How to Play
* **Controls:** Use `W`, `A`, `S`, `D` keys to move. ⌨️
* **Objective:** Collect coffee to keep your energy bar filled. Reach the laptop to "code" and increase your score. 📈
* **Lose condition:** Colliding with a **Boss** or running out of energy ends the game immediately. ☠️
* **Restart/Continue:** Click the **RESTART** button to reset the game instantly without refreshing the page or **CONTINUE** to resume from your last saved level. 🔄

## 5. 🛠 Tech Decisions
* **Hybrid Approach (Canvas + DOM):**
  * **Why Hybrid?** I chose a hybrid approach to leverage the strengths of both technologies. Canvas provides high-performance rendering for smooth 60 FPS gameplay with multiple moving entities, while DOM allows for easy styling and accessibility of the UI menus. This demonstrates mastery of both core web technologies as allowed by the project rules. 🎨🏗️
  * **Canvas API:** Used for rendering the game world, player, bosses, and items. It handles complex animations and frequent updates efficiently without causing browser reflows.
  * **DOM Manipulation:** Used for the User Interface (Start Screen, HUD, Game Over Menu). Managing screens via CSS class toggling (.active) is cleaner and more maintainable than drawing text/buttons on Canvas.
* **Architecture:** Implemented using **Functional Programming** patterns with modular functions. Game state is managed centrally, ensuring logic separation between rendering (render()) and updating (update()).  🧩
* **Persistence:** High scores and current career level are saved locally using the `localStorage` API. This allows players to use the **"Continue"** feature and resume their career progress after closing the browser. 💾
* **State Management:** The game uses a simple state machine (`start`, `playing`, `over`) to control flow. Event listeners trigger state changes, which in turn update the visible screen and game logic. 🎭

## 6. 📖 AI Diary
The development log, detailing logic used and challenges overcome with AI, can be found here: [AI_DIARY.md](AI_DIARY.md) 📝

## 7. 🌐 Live Demo
Play the game here: https://shebnem-m.github.io/Coffee-or-Fired-/ 🔗

## 8. 🐛 Known Bugs & Improvements
* **Known Bugs & Limitations:** *Currently, collision detection can be sensitive during high-speed boss movement.*
    * **Predictable Boss Spawns: 📈** Occasionally, bosses may spawn from similar coordinates, making early encounters slightly predictable. ⚠️
    * **No Power-Up Timer:** Active power-ups (Speed/Shield) do not have a visible countdown timer, so players must estimate when the effect will end based on visual cues alone. ⏳
* **Optimization:** 
    * Implementing a randomized offset for boss spawn positions.
    * Adding a visual countdown circle around the player during power-up activation.
* **Future Improvements:** 
    * Add a "Focus Mode" triggered by the `Spacebar`. ⌨️
    * Increase Boss speed as the score grows. 📈
    * Implement background office-ambience audio. 🎵
    * Global Leaderboard integration. 🏆

---
*Developed with ❤️ to master Vanilla JavaScript and Game Logic. ⭐ If you like this project, don't forget to give it a star!*