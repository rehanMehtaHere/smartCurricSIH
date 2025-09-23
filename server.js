const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// --- API routes first ---
app.get("/api/:file", (req, res) => {
  // build an absolute path to the json file
  const filePath = path.join(__dirname, "data", `${req.params.file}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not found");
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading file");
  }
});

app.post("/api/:file", (req, res) => {
  const filePath = path.join(__dirname, "data", `${req.params.file}.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.send("Saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error writing file");
  }
});

// --- then static files ---
app.use(express.static(__dirname));

app.listen(3000, () =>
  console.log("Fake backend running at http://localhost:3000")
);