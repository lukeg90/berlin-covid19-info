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

app.get("/place/specific/:placequery", async (req, res) => {
    console.log("params: ", req.params.placequery);
    try {
        const { data } = await services.placeSearch(req.params.placequery);
        console.log("place search response: ", data);
        res.json({ places: data.candidates });
    } catch (err) {
        console.log(err);
    }
});

app.get("/place/general/:textquery", async (req, res) => {
    try {
        const { data } = await services.textSearch(req.params.textquery);
        console.log("text search response: ", data.results);
        res.json({ places: data.results });
    } catch (err) {
        console.log(err);
    }
});

app.get("/place/details/:id", async (req, res) => {
    try {
        const { data } = await services.getPlaceDetails(req.params.id);
        console.log("get place details response: ", data);
        res.json({ details: data.result });
    } catch (err) {
        console.log(err);
    }
});

app.get("/place/nearby/:location", async (req, res) => {
    try {
        console.log("location: ", req.params.location);
        // make random request until we get some results
        let results = [];
        do {
            const { data } = await services.getPlacesNearby(
                "52.539507,13.4104319"
            );
            results = data.results;
        } while (results.length == 0);
        res.json({ places: results });
        console.log("nearby places: ", results);
    } catch (err) {
        console.log("get places nearby error: ", err);
    }
});

app.listen(process.env.PORT || 3000, () => console.log("server listening..."));
