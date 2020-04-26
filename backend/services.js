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

exports.getPlacesNearby = location => {
    return axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
            params: {
                key: API_KEY,
                location: location,
                radius: "1000",
                language: "en",
                fields:
                    "business_status,formatted_address,geometry,icon,name,photo,place_id,type,url,vicinity,website",
                type: getRandomType()
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
                    "business_status,formatted_address,geometry,icon,name,photo,place_id,type,url,vicinity,website"
            }
        }
    );
};

const getRandomType = () => {
    const types = [
        "art_gallery",
        "bicycle_store",
        "book_store",
        "cemetery",
        "church",
        "convenience_store",
        "drugstore",
        "florist",
        "hair_care",
        "laundry",
        "library",
        "meal_delivery",
        "meal_takeaway",
        "museum",
        "park",
        "pet_store",
        "pharmacy",
        "post_office",
        "subway_station",
        "supermarket",
        "bank",
        "natural_feature",
        "town_square"
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    console.log("Random type: ", randomType);
    return randomType;
};
