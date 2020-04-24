const express = require("express");
const cors = require("cors");
const app = express();
const services = require("./services");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Backend sanity check</h1>");
});

app.get("/covid-stats", async (req, res) => {
    try {
        const { data } = await services.berlinCovidStats();
        console.log("results from RKI API: ", data);
        const berlinStats = data.states.filter(state => state.name == "Berlin");
        console.log("Berlin stats: ", berlinStats);
        res.json({ berlinStats: berlinStats[0] });
    } catch (err) {
        console.log("Error getting stats from RKI API: ", err);
    }
});

app.get("/place/:textquery", async (req, res) => {
    console.log("params: ", req.params.textquery);
    try {
        const { data } = await services.findPlaceByText(req.params.textquery);
        console.log("get place by query response: ", data);
        res.json({ places: data.candidates });
    } catch (err) {
        console.log(err);
    }
});

app.get("/place/details/:id", async (req, res) => {
    try {
        const { data } = await services.getPlaceDetails(req.params.id);
        console.log("get place details response: ", data);
        res.json({ details: data });
    } catch (err) {
        console.log(err);
    }
});

app.listen(process.env.PORT || 3000, () => console.log("server listening..."));
