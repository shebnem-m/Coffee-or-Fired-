📖 **AI Diary: Office vs Coffee Machine Development Log**

This document logs my journey building "Office Overload" using three different AI tools (**Gemini**, **Claude**, and **Qwen**) and the design decisions behind them. It details the challenges faced, the solutions implemented, and the lessons learned during development.


**[May 26, 2024] - Visualizing the Game Concept with Gemini**

**What I asked the AI:** "Describe a top-down office survival game where a developer avoids bosses and collects coffee."

**Tool Used: Gemini AI**

**Outcome:** Gemini provided a detailed text description and suggested a pixel-art style. It helped me visualize the entities: Player (Developer), Bosses, Coffee Machines, and Laptops.

**Why this step?** Before coding, I needed a image. Gemini helped me define the "vibe" of the game—retro yet modern office chaos. This sketch became the foundation for my Excalidraw drawing.

**Time spent:** ~15 minutes.


**[May 27, 2024] - Initial Code Structure with Claude**

**What I asked the AI:** "Generate HTML, CSS, and JS code for this game using Canvas API based on the description."

**Tool Used: Claude AI**

**Outcome:** Claude provided a working prototype with Canvas rendering. The movement was smooth, but the UI was basic.

**What was wrong?** The code was purely Canvas-based. While functional, it lacked the interactive feel of a modern web app for menus and HUDs. Also, the character designs were simple geometric shapes.

**How I fixed it:** I realized I needed more control over the UI. I decided to keep the game loop in Canvas but move the menus to DOM. This led to my next step with Qwen.

**Time spent:** ~45 minutes.


**[May 27, 2024] - The Failed Pure-DOM Attempt & Switch to Hybrid**

**What I asked the AI:** "Refactor this code to use only DOM manipulation for all entities as per my initial plan."

**Tool Used:** Qwen AI

**Outcome:** Qwen provided a version where every entity (Player, Boss, Coffee) was a div.

**What was wrong?** The performance was terrible. With multiple bosses moving, the browser lagged significantly. Also, the characters looked like simple colored squares because CSS styling for complex pixel art on divs was messy and limited. It didn't look like a game; it looked like a broken website.

**How I fixed it:** I realized Pure-DOM was not suitable for real-time action games. I consulted Gemini AI again, which suggested a Hybrid Approach: Use Canvas for the game world (smooth rendering) and DOM for the UI (menus/HUD). I manually merged the Canvas logic from Claude with the DOM UI structure, creating a balanced and performant game engine.

**Lesson Learned:** Not all AI suggestions are optimal. Critical thinking is required to choose the right tool (Canvas vs. DOM) for the specific task (Game Loop vs. UI).

**Time spent:** ~1.5 hours.


**[May 28, 2024] - Balancing Gameplay: Coffee & Combo System**

**What I asked the AI:** "How can I make the coffee collection mechanic more engaging than just random spawns?"

**Problem:** Initially, coffee machines appeared randomly. This made the game too easy and chaotic.

**Solution:** I redesigned the mechanic:
    1. **Static Placement:** Coffee machines are now placed at fixed strategic points (corners/center).
    2. **Combo System:** Drinking coffee in quick succession builds a "Combo," granting bonus points.
    3. **Energy Management:** Players must manage their energy bar carefully. If it hits zero, they lose.
**Why?** This adds strategy. Players can't just run around; they must plan their route to maximize combos while avoiding bosses.

**Time spent:** ~30 minutes.


**[May 29, 2024] - User Retention: Continue Feature & Career Progression**

**What I asked the AI:** "How can I prevent players from getting frustrated by restarting from Level 1 every time?"

**Problem:** Losing progress after reaching Level 5 was discouraging. Players might quit.

**Solution:**
    1. **Continue Feature:** Implemented `localStorage` to save the current Level. If a player loses, they can "Continue" from that Level (though score resets). This keeps them motivated.
    2. **Career Ranks:** Added a progression system (Intern → Junior → ... → Chief Architect). Each rank changes the player's appearance (color/crown).
    3. **Win Condition:** Reaching Level 15 triggers a "You Win!" screen, giving a sense of ultimate achievement.
    
**Impact:** These features transformed the game from a simple arcade loop into a progressive career simulator, significantly improving user retention.

**Time spent:** ~40 minutes.


**[May 29, 2024] - Implementing Persistent State with LocalStorage**

**What I asked the AI:** "How can I allow players to continue from their last level after closing the browser or losing?"

**Problem:** Initially, if a player closed the tab or lost, all progress was lost. This felt unfair for high-level players.

**Solution:** I implemented `localStorage` to save two key variables: `officeVsCoffee_savedLevel` and `officeVsCoffee_savedScore`.
* On `endGame()`, the current level is saved.
* On `initGame('continue')`, the game checks localStorage. If data exists, it loads the saved level and resets the score to 0 (to maintain challenge).
  
**Technical Detail**: I added a check in the Start Screen: if `localStorage.getItem('officeVsCoffee_savedLevel')` is not null, the "Continue" button becomes active. Otherwise, it remains locked/hidden. This ensures players only see the option when they have progress to resume.
 
**Time spent:** ~37 minutes.


**[May 30, 2024] - Visual Feedback & Win Condition Logic**

**What I asked the AI:** "How can I provide immediate visual feedback when a player levels up, and how should the game end when they reach the top rank?"

**Problem:** Players didn't always notice when they leveled up because the HUD text change was subtle. Also, reaching Level 15 needed a special celebration.

**Solution:**
    1. Level-Up Banner: I created a hidden `div` (`#level-up-banner`) that slides down from the top of the screen whenever `currentLevel` increments. It displays the new Rank (e.g., "🚀 LEVEL UP: SENIOR DEV") and disappears after 2 seconds using `setTimeout`. This uses CSS transitions for smooth animation without pausing the game loop.
    2. Win Condition: I added a check in `checkCollisions()`: `if (currentLevel >= 15 && !hasWonToday)`. If true, it triggers `triggerWinGame()`.
    3. Dual End-Screen Options: In the Game Over screen, I added two buttons:
   * CONTINUE: Loads the saved level (from LocalStorage) but resets score.
   * RESTART: Resets everything to Level 1 and returns to the Main Menu.
     
**Why?** The banner keeps players engaged by rewarding them visually. The dual buttons give players agency: they can either push for a higher high score (Restart) or enjoy their unlocked content (Continue).

**Time spent:** ~40 minutes.


**[May 30, 2024] - UI Logic: Locking the Continue Button**

**What I asked the AI:** "How can I ensure the 'Continue' button is disabled when a player starts the game for the first time?"

**Problem:** Initially, the "Continue" button was always visible, which confused new players who had no saved progress.

**Solution:** I implemented a logic check in `window.onload` and `updateContinueButtonVisibility()`.
   * The function checks localStorage.getItem('officeVsCoffee_savedLevel').
   * If it returns `null` (no data), the button gets the `.locked` CSS class (grayed out) or is hidden.
   * Once the player finishes a session (wins or loses), data is saved to LocalStorage. On the next load, the button becomes active.
     
**Why?** This prevents errors and improves UX by only showing relevant options to the user.

**Time spent:** ~15 minutes.


**[May 31, 2024] - Balancing Difficulty & Boss Scaling**

**What I asked the AI:** "The game becomes impossible at Level 10+ because coffee drains too fast and bosses are too numerous."

**Problem:** Playtesting revealed that the initial `COFFEE_DRAIN_RATE` was too high for higher levels. Players would reach "Lead Dev" rank but die instantly due to energy depletion, making the win condition unreachable.

**Solution:**
    1. **Adjusted Drain Rate:** I lowered the base `COFFEE_DRAIN_RATE` from `0.015` to `0.007` and reduced the scaling factor per level. This gives players more time to strategize.
    2. **Boss Scaling:** Instead of just increasing speed, I made the number of bosses scale with the level (`for(let i=0; i < currentLevel + 1; i++) spawnBoss()`). This creates a chaotic but manageable crowd rather than just one super-fast enemy.
    
**Outcome:** The game is now challenging but fair. Players can realistically reach Level 15 and see the "Win" screen if they play skillfully.

**Time spent:** ~45 minutes (playtesting and tweaking values).
