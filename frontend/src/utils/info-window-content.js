export default function getInfoWindowContent(place) {
    let dynamicContent = "";
    let websiteLink;
    if (!place.website) {
        websiteLink = "";
    } else {
        websiteLink = `<a target='_blank' href='${place.website}'>Check the business website for more information.</a>`;
    }
    // business_status field not being returned for some reason
    for (let i = 0; i < place.types.length; i++) {
        if (["park", "cemetery", "zoo"].includes(place.types[i])) {
            dynamicContent = `
                <h2 class="open">Open</h2>
                <h3>Parks and open area spaces are open to the public, provided that social distance is maintained. On permanently installed seating (such as benches), the minimum distance is 1.5 m. In meadows and open spaces, the minimum distance is 5 m.</h3>
            `;
            break;
        }
        if (["museum", "art_gallery"].includes(place.types[i])) {
            dynamicContent = `
                <h2 class="open">Open from 04 May</h2>
                <h3>Go and reflect on past civilizations while keeping your distance to preserve the current one.</h3>
            `;
            break;
        }
        if (place.types[i] == "hair_care") {
            dynamicContent = `
                <h2 class="restricted">Open from 04 May with restrictions</h2>
                <h3>Finally you can get a haircut! Mask or other covering of the mouth and nose is required</h3>
            `;
            break;
        }
        if (
            [
                "supermarket",
                "pharmacy",
                "convenience_store",
                "grocery_or_supermarket",
                "drugstore",
                "liquor_store",
                "gas_station",
                "hardware_store",
                "laundry",
                "pet_store",
                "bicycle_store",
                "book_store",
                "car_dealer",
                "car_repair",
                "library"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="open">Open</h2>
                <h3>All retail outlets selling essential supplies are permitted to be open</h3>
            `;
            break;
        }
        if (["bank", "atm", "post_office"].includes(place.types[i])) {
            dynamicContent = `
                <h2 class="open">Open</h2>
                <h3>Banks and post offices offer essential services and remain open</h3>
            `;
            break;
        }
        if (
            [
                "church",
                "synagogue",
                "mosque",
                "hindu_temple",
                "place_of_worship"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="restricted">Open from 04 May with restrictions</h2>
                <h3>All religious gatherings of up to 50 people are allowed, space permitting. But please do not attempt to pass off your house party as a gathering of the Church of the Flying Spaghetti Monster.</h3>
            `;
            break;
        }
        if (
            [
                "bowling_alley",
                "casino",
                "movie_theater",
                "night_club",
                "stadium",
                "amusement_park"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="closed">Closed</h2>
                <h3>All amusement venues are closed indefinitely</h3>
            `;
            break;
        }
        if (["beauty_salon", "spa"].includes(place.types[i])) {
            dynamicContent += `
                <h2 class="closed">Closed</h2>
                <h3>Personal care service industries are closed indefinitely</h3>
            `;
            break;
        }
        if (place.types[i] == "gym") {
            dynamicContent = `
                <h2 class="closed">Closed</h2>
                <h3>Gyms are closed indefinitely.</h3>
            `;
            break;
        }
        if (place.types[i] == "hospital") {
            dynamicContent = `
                <h2 class="restricted">Open with restrictions</h2>
                <h3>Hospitals and care facilities remain operational, but it's only permitted to visit children under 16, seriously or terminally ill patients, or persons giving birth.</h3>
            `;
            break;
        }
        if (place.types[i] == "lodging" || place.types[i] == "campground") {
            dynamicContent = `
                <h2 class="closed">Closed</h2>
                <h3>Hotels and other lodgings are not allowed to accommodate tourists</h3>
            `;
            break;
        }
        if (place.business_status == "CLOSED_TEMPORARILY") {
            dynamicContent = `
                <h2 class="closed">Closed</h2>
                <h3>The business owner has marked this place as being temporarily closed due to COVID-19 restrictions</h3>
                ${websiteLink}
            `;
            break;
        }
        if (
            [
                "bar",
                "cafe",
                "meal_delivery",
                "meal_takeaway",
                "restaurant",
                "bakery"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="restricted">May operate with restrictions</h2>
                <h3>Bars, restaurants, and cafes are not allowed to seat guests, but they may still offer delivery and pick-up service.</h3>
                ${websiteLink}
            `;
            break;
        }
        if (
            [
                "car_wash",
                "clothing_store",
                "department_store",
                "furniture_store",
                "electronics_store",
                "florist",
                "home_goods_store",
                "jewelry_store",
                "shoe_store",
                "store"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="restricted">May operate with restrictions</h2>
                <h3>Retail stores may operate if they have a sales area of 800 square meters or less, or if they cordon off an area of this size.</h3>
                ${websiteLink}
            `;
            break;
        }
        if (
            [
                "airport",
                "bus_station",
                "light_rail_station",
                "subway_station",
                "train_station",
                "transit_station"
            ].includes(place.types[i])
        ) {
            dynamicContent = `
                <h2 class="restricted">May operate with restrictions</h2>
                <h3>A mask or other covering of the mouth and nose is required when using all modes of public transportation. Please note that many routes have been cancelled or suspended.</h3>
            `;
            break;
        }
        if (
            ["school", "secondary_school", "university"].includes(
                place.types[i]
            )
        ) {
            dynamicContent = `
                <h2 class="open">Open</h2>
                <h3>School is back in session.</h3>
            `;
            break;
        }
    }
    const content = `
            <div class="info-window-content">
                <h1>${place.name}</h1>
                <h3>${place.formatted_address}</h3>
                <hr>
                <br />
                <div class="dynamic-content">${dynamicContent}</div>
                <br />
                <a target="_blank" href=${place.url}>View on Google Maps</a>
            </div>
            `;
    return content;
}
