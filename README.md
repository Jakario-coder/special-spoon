# special-spoon
A self-contained browser game hub with a local account system and saved progress.

Features:
- Doge Miner 1 clicker-style game
- Doge Miner 2 clicker-style game
- Drive Mad inspired obstacle dodging game
- Fullscreen toggle to hide the website header
- Local account creation/login using browser storage
- No external website redirects

How to run:
1. Open `index.html` in a browser, or
2. Serve the folder with a quick static server such as:
   `python -m http.server 8000`
3. Visit `http://localhost:8000`

Saved progress is stored in the browser using localStorage.
