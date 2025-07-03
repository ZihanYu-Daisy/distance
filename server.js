// server.js
import express from "express";

const app  = express();
const PORT = process.env.PORT || 3000;

/* --------------------------------------------------
   GET /api/distance?x=…&y=…&z=…
   Returns JSON { distance: number }
-------------------------------------------------- */
app.get("/api/distance", (req, res) => {
  // 1. grab query params; treat missing values as 0
  const x = parseFloat(req.query.x) || 0;
  const y = parseFloat(req.query.y) || 0;
  const z = parseFloat(req.query.z) || 0;

  // 2. quick sanity check
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    return res.status(400).json({ error: "x, y, and z must be numeric" });
  }

  // 3. compute d = √(x² + y² + z²)
  const distance = Math.sqrt(x * x + y * y + z * z);

  // 4. respond as JSON
  res.json({ distance: +distance.toFixed(2) });
});

/* --------------------------------------------------
   (Optional) GET /  → little HTML form for humans
-------------------------------------------------- */
app.get("/", (_, res) => {
  res.send(/* html */`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Distance Calculator</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          input { margin: 4px 0; padding: 6px; width: 70px; }
          button { padding: 6px 12px; }
          #result { margin-top: 16px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Distance to (0,0,0)</h1>
        <form id="distForm">
          x: <input type="number" step="any" name="x" value="0"><br>
          y: <input type="number" step="any" name="y" value="0"><br>
          z: <input type="number" step="any" name="z" value="0"><br>
          <button type="submit">Calculate</button>
        </form>
        <p id="result"></p>

        <script>
          const form   = document.getElementById("distForm");
          const result = document.getElementById("result");

          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const params = new URLSearchParams(new FormData(form));
            const r = await fetch("/api/distance?" + params);
            const json = await r.json();
            result.textContent = "Distance = " + json.distance;
          });
        </script>
      </body>
    </html>
  `);
});

/* -------------------------------------------------- */
app.listen(PORT, () =>
  console.log(`✅  Distance API running at http://localhost:${PORT}`)
);
