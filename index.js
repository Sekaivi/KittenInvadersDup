const express = require("express");
const { readFile } = require("fs/promises");
const path = require("path");
const PORT = 3333;

const app = express();
app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html/index.html"));
});

app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html/Testgame.html"));
});
