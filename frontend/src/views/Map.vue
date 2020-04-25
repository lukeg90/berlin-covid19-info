<template>
    <div>
        <form>
            <input
                type="text"
                id="placeSearch"
                placeholder="Search for a specific place"
                v-model="placeSearchQuery"
            />
            <button @click.prevent="placeSearch">Submit</button>
            <input
                type="text"
                id="textSearch"
                placeholder="Search for a place"
                v-model="textSearchQuery"
            />
            <button @click.prevent="textSearch">Submit</button>
        </form>
        <div class="map-container">
            <div class="search-results-container">
                <div
                    class="search-result"
                    v-for="result in searchResults"
                    :key="result.place_id"
                    @click="getPlaceDetails(result)"
                >
                    <h3>{{ result.name }}</h3>
                    <h4>{{ result.formatted_address }}</h4>
                </div>
            </div>
            <div class="map"></div>
        </div>
    </div>
</template>

<script>
// User can search for place in Berlin, which will populate a list next to the map using place search api
// (add markers to the map?)

// using place search API will be cheapest, but will only give one result and user search needs to be specific

// consider using nearby search or text search to display results of more general search queries

// by clicking on the place in the list (or on the map marker?), user should be shown place details
// based on place type, display information about whether the place is open or not

import googleInit from "../utils/gmaps";
import axios from "axios";
export default {
    name: "Map",
    data: () => {
        return {
            map: "",
            placeSearchQuery: "",
            textSearchQuery: "",
            searchResults: [],
            placeDetails: {},
            markers: [],
            infoWindow: ""
        };
    },
    async mounted() {
        try {
            const google = await googleInit();
            const map = new google.maps.Map(document.querySelector(".map"), {
                // center on Berlin
                center: { lat: 52.52, lng: 13.405 },
                zoom: 11,
                streetViewControl: false
            });
            // prevent user zooming out of Berlin
            map.setOptions({ minZoom: 11 });
            this.map = map;
            this.createInfoWindow();
        } catch (err) {
            console.log("error intializing google maps API: ", err);
        }
    },
    methods: {
        setMapOnAll(map) {
            this.markers.forEach(marker => marker.setMap(map));
        },
        clearMarkers() {
            this.setMapOnAll(null);
        },
        showMarkers() {
            this.setMapOnAll(this.map);
        },
        deleteMarkers() {
            this.clearMarkers();
            this.markers = [];
        },
        addMarkers(places) {
            places.forEach(place => {
                let marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: this.map
                });
                this.markers.push(marker);
                let self = this;
                // add click event listener to marker which gets place details and opens info window
                marker.addListener("click", function() {
                    // get place details on click
                    self.getPlaceDetails(place);
                });
            });
        },
        createInfoWindow() {
            // storing in data property ensures that only one info window can be open at any time
            let infowindow = new google.maps.InfoWindow();
            this.infoWindow = infowindow;
        },
        placeSearch() {
            this.deleteMarkers();
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/place/specific/${this.placeSearchQuery}`
                )
                .then(({ data }) => {
                    console.log("Place search data: ", data.places);
                    // add results to search results div
                    this.searchResults = data.places;
                    // add markers to map?
                    this.addMarkers(this.searchResults);
                    this.placeSearchQuery = "";
                })
                .catch(err => {
                    console.log("Error in place search: ", err);
                });
        },
        textSearch() {
            this.deleteMarkers();
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/place/general/${this.textSearchQuery}`
                )
                .then(({ data }) => {
                    console.log("Text search data: ", data.places);
                    this.searchResults = data.places;
                    this.addMarkers(this.searchResults);
                    this.textSearchQuery = "";
                })
                .catch(err => {
                    console.log("Error in text search: ", err);
                });
        },
        getPlaceDetails(place) {
            // pan to location, set zoom
            console.log("place: ", place.name);
            this.map.panTo(place.geometry.location);
            this.map.setZoom(14);
            // call backend
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/place/details/${place.place_id}`
                )
                .then(({ data }) => {
                    console.log("Place details: ", data.details);
                    this.placeDetails = data.details;
                    // also want infowindow to appear on marker with click on place
                    // need to find marker which matches location of place
                    console.log("Marker position: ", this.markers[0].position);
                    let markerMatch = this.markers.find(
                        marker =>
                            marker.position.lat().toFixed(7) ==
                                this.placeDetails.geometry.location.lat.toFixed(
                                    7
                                ) &&
                            marker.position.lng().toFixed(7) ==
                                this.placeDetails.geometry.location.lng.toFixed(
                                    7
                                )
                    );
                    console.log("marker match found? ", markerMatch);
                    let content = this.getInfoWindowContent(this.placeDetails);
                    this.infoWindow.setContent(content);
                    this.infoWindow.open(this.map, markerMatch);
                })
                .catch(err => {
                    console.log("Error getting place details: ", err);
                });
        },
        getInfoWindowContent(place) {
            let dynamicContent = "";
            // business_status field not being returned for some reason
            // if (place.business_status == "CLOSED_TEMPORARILY") {
            //     dynamicContent += `
            //     <h3 class="closed">This business is currently marked as temporarily closed due to COVID-19.</h3>
            //     `;
            // }
            for (let i = 0; i < place.types.length; i++) {
                if (place.types[i] == "park") {
                    dynamicContent += `
                            <h2 class="open">Open</h2>
                            <h3>Parks are open to the public, provided that social distance is maintained. On permanently installed seating (such as benches), the minimum distance is 1.5 m. In meadows and open spaces, the minimum distance is 5 m.</h3>`;
                    break;
                }
                if (place.types[i] == "museum") {
                    dynamicContent += `
                            <h2 class="soon-open">Permitted to open from 04 May, 2020</h2>
                            <h3>Go and reflect on past civilizations while keeping your distance to preserve the current one.</h3>
                        `;
                    break;
                }
                if (place.types[i] == "hair_care") {
                    dynamicContent += `
                        <h2 class="soon-open">Permitted to open from 04 May, 2020</h2>
                        <h3>Finally you can get a haircut!</h3>
                    `;
                    break;
                }
                if (
                    place.types[i] == "supermarket" ||
                    place.types[i] == "pharmacy" ||
                    place.types[i] == "convenience_store" ||
                    place.types[i] == "grocery_or_supermarket" ||
                    place.types[i] == "drugstore"
                ) {
                    dynamicContent += `
                        <h2 class="open">Open</h2>
                        <h3>All retail outlets selling essential supplies such as food and medication will remain open</h3>
                    `;
                    break;
                }
            }

            const content = `
            <div class="info-window-content">
                <h1>${place.name}</h1>
                <div class="dynamic-content">${dynamicContent}</div>
            </div>
            `;
            return content;
        }
    }
};
</script>

<style>
.map-container {
    display: flex;
    height: 600px;
    width: 100%;
    justify-content: space-between;
}

.search-results-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 40%;
    overflow-y: scroll;
}

.search-result {
    height: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 10px;
}

.search-result:hover {
    cursor: pointer;
    background: lightseagreen;
}

.map {
    height: 100%;
    width: 60%;
    justify-self: right;
}

.info-window-content {
}

.open {
    color: green;
}

.soon-open {
    color: orange;
}

.closed {
    color: red;
}
</style>
