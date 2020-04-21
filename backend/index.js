const express = require("express");
const app = express();

app.listen(process.env.PORT || 3000, () => console.log("server listening..."));

app.get("/", (req, res) => {
    res.send("<h1>Backend sanity check</h1>");
});
