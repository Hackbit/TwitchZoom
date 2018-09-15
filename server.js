const express = require("express");
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

app.get("/api", (req, res) => {
  console.log("/api reached");
  res.json({ twitch_bot: "Connected!" });
});

app.get("/api/:channel", (req, res) => {
  console.log("/api:channel reached");
  res.json({ twitch_bot: "Connected!", id: req.params.channel });
});

app.listen(3001, () => console.log("Example app listening on port 3001"));
