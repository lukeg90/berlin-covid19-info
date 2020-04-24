const axios = require("axios");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const API_KEY = secrets.MAPS_KEY;

exports.findPlaceByText = textQuery => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${textQuery}&inputtype=textquery&language=en&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&locationbias=circle:5000@52.520008,13.404954&key=${API_KEY}`
    );
};
