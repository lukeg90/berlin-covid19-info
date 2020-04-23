const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

app.get("/", (req, res) => {
    res.send("<h1>Backend sanity check</h1>");
});

app.get("/covid-stats", (req, res) => {
    axios
        .get("https://rki-covid-api.now.sh/api/states")
        .then(response => {
            console.log("results from RKI API: ", response.data);
            const berlinStats = response.data.states.filter(
                state => state.name == "Berlin"
            );
            console.log("Berlin stats: ", berlinStats);
            res.json({ berlinStats: berlinStats[0] });
        })
        .catch(err => {
            console.log("error getting results from RKI API: ", err);
        });
});

app.listen(process.env.PORT || 3000, () => console.log("server listening..."));
