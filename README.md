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
**Office Overload** is a top-down survival challenge where the player must balance productivity with caffeine intake. The game features a dynamic "Coffee Bar" system, AI-controlled enemy pathing, and strategic decision-making. 🏃‍♂️💨

## 2. 👥 Entities
* **Player 👩‍💻:** The developer, moved via `W-A-S-D`. Monitors energy relative to the workspace.
* **Boss 👔:** An aggressive enemy with autonomous patrol patterns. Touching them triggers **Game Over**!
* **Coffee Machine ☕:** A static utility. Overlapping with this entity refills the `Coffee Bar`.
* **Laptop 💻:** The central objective. Reach it with energy to "write code" and score points!

## 3. 🎨 Game Sketch
![Game Sketch](Coffee%20vs%20Ofice%20game.png)

## 4. 🕹 How to Play
* **Controls:** Use `W`, `A`, `S`, `D` keys to move. ⌨️
* **Objective:** Collect coffee to keep your energy bar filled. Reach the laptop to "code" and increase your score. 📈
* **Lose condition:** Colliding with a **Boss** ends the game immediately. ☠️
* **Restart:** Click the **RESTART** button to reset the game instantly without refreshing the page. 🔄

## 5. 🛠 Tech Decisions
* **DOM Manipulation:** The entire world is rendered using native DOM nodes (`div` elements) to strictly demonstrate mastery of DOM manipulation. 🏗️
* **Architecture:** Implemented using **Object-Oriented Programming (OOP)**. Each entity is an instance of a `class` for modularity. 🧩
* **Persistence:** High scores are saved locally using `localStorage` API. 💾
* **State Management:** Screens (`start`, `game`, `gameover`) are managed via CSS class toggling (`.active`). 🎭

## 6. 📖 AI Diary
The development log, detailing logic used and challenges overcome with AI, can be found here: [AI_DIARY.md](AI_DIARY.md) 📝

## 7. 🌐 Live Demo
Play the game here: [Insert Your GitHub Pages URL Here] 🔗

## 8. 🐛 Known Bugs & Improvements
* **Known Bugs:** *Currently, collision detection can be sensitive during high-speed boss movement.* ⚠️
* **Optimization:** *Fine-tuning collision detection for complex boss movements.
* **Future Improvements:** * Add a "Focus Mode" triggered by the `Spacebar`. ⌨️
    * Increase Boss speed as the score grows. 📈
    * Add background office-ambience audio. 🎵
    * Global Leaderboard integration. 🏆

---
*Developed with ❤️ to master Vanilla JavaScript and Game Logic. ⭐ If you like this project, don't forget to give it a star!*