const secrets = require("../../secrets");

let API_KEY;
if (
    process.env.VUE_APP_API_URL ==
    "https://covid19info-berlin-backend.herokuapp.com"
) {
    API_KEY = secrets.MAPS_PROD_KEY;
} else {
    API_KEY = secrets.MAPS_DEV_KEY;
}

const CALLBACK_NAME = "googleCallback";

let initialized = !!window.google;
let resolveInitPromise;
let rejectInitPromise;

const initPromise = new Promise((resolve, reject) => {
    resolveInitPromise = resolve;
    rejectInitPromise = reject;
});

export default function init() {
    if (initialized) return initPromise;

    initialized = true;

    window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`;
    script.onerror = rejectInitPromise;
    document.querySelector("head").appendChild(script);

    return initPromise;
}
