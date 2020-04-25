const axios = require("axios");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const API_KEY = secrets.MAPS_KEY;

exports.berlinCovidStats = () => {
    return axios.get("https://rki-covid-api.now.sh/api/states");
};

exports.placeSearch = placeQuery => {
    return axios.get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
        {
            params: {
                key: API_KEY,
                input: placeQuery,
                inputtype: "textquery",
                language: "en",
                fields: "formatted_address,geometry,name,place_id,types",
                locationbias: "circle:10000@52.520008,13.404954"
            }
        }
    );
};

exports.textSearch = textQuery => {
    return axios.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
        {
            params: {
                key: API_KEY,
                query: textQuery,
                location: "52.520008,13.404954",
                radius: "10000",
                language: "en"
            }
        }
    );
};

exports.getPlaceDetails = placeId => {
    return axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
            params: {
                key: API_KEY,
                place_id: placeId,
                language: "en",
                fields:
                    "address_component,adr_address,business_status,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity,website"
            }
        }
    );
};
