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

exports.findPlaceByText = textQuery => {
    return axios.get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
        {
            params: {
                key: API_KEY,
                input: textQuery,
                inputtype: "textquery",
                language: "en",
                fields:
                    "formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types",
                locationbias: "circle:10000@52.520008,13.404954"
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
                    "address_component,adr_address,business_status,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity"
            }
        }
    );
};
