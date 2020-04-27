<template>
    <div class="map-view">
        <div class="header">
            <h1>Where Can I Go?</h1>
            <h3>
                Berlin is slowly coming back to life. Check the map to see
                what's opening back up and what's still restricted.
            </h3>
            <div class="queries">
                <input
                    type="text"
                    id="textSearch"
                    placeholder="Search for a place"
                    v-model="textSearchQuery"
                    @keyup.enter="textSearch"
                />
                <!-- <button @click="textSearch">Search</button> -->
                <span>OR</span>
                <button class="nearby-button" @click="nearbySearch">
                    See what's open around me
                </button>
            </div>
        </div>
        <div class="map-container">
            <div class="search-results-container">
                <div
                    class="search-result"
                    :class="{ highlight: result.place_id == selected }"
                    v-for="result in searchResults"
                    :key="result.place_id"
                    @click="
                        getPlaceDetails(result);
                        selected = result.place_id;
                    "
                >
                    <h3>{{ result.name }}</h3>
                    <h4>{{ result.formatted_address || result.vicinity }}</h4>
                </div>
                <div
                    class="no-results"
                    v-if="activeSearch && searchResults.length == 0"
                >
                    <h3>No results</h3>
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
import getInfoWindowContent from "../utils/info-window-content";
import axios from "axios";
export default {
    name: "Map",
    data: () => {
        return {
            map: "",
            textSearchQuery: "",
            searchResults: [],
            placeDetails: {},
            markers: [],
            infoWindow: "",
            selected: "",
            activeSearch: false
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
                    // highlight appropriate menu item and scroll to it
                    self.selected = place.place_id;
                });
            });
        },
        createInfoWindow() {
            // storing in data property ensures that only one info window can be open at any time
            let infowindow = new google.maps.InfoWindow();
            this.infoWindow = infowindow;
        },
        textSearch() {
            this.deleteMarkers();
            this.activeSearch = true;
            axios
                .get(`place/general/${this.textSearchQuery}`)
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
        nearbySearch() {
            this.deleteMarkers();
            // get geolocation
            let self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    const locationString = `${geolocation.lat},${geolocation.lng}`;
                    console.log("geolocation: ", locationString);
                    axios
                        .get(`place/nearby/${locationString}`)
                        .then(({ data }) => {
                            console.log("nearby places: ", data.places);
                            // self.map.setCenter(geolocation);
                            self.map.setCenter({
                                lat: 52.539507,
                                lng: 13.4104319
                            });
                            self.map.setZoom(14);
                            self.searchResults = data.places;
                            self.addMarkers(self.searchResults);
                            console.log("response for nearby search: ", data);
                        });
                });
            } else {
                alert("Sorry, your browser does not support geolocation");
            }
        },
        getPlaceDetails(place) {
            // pan to location, set zoom
            console.log("place: ", place.name);
            this.map.panTo(place.geometry.location);
            this.map.setZoom(16);
            // call backend
            axios
                .get(`place/details/${place.place_id}`)
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
                    let content = getInfoWindowContent(this.placeDetails);
                    this.infoWindow.setContent(content);
                    this.infoWindow.open(this.map, markerMatch);
                })
                .catch(err => {
                    console.log("Error getting place details: ", err);
                });
        }
    }
};
</script>

<style>
.map-view {
    padding-top: 80px;
    height: 100%;
}
.header {
    display: flex;
    height: 25%;
    flex-direction: column;
    justify-content: space-around;
    padding: 20px;
}

input[type="text"] {
    border-radius: 5px;
    font-size: larger;
    outline: none;
    height: 40px;
    width: 300px;
}

input[type="text"]:focus {
    border: 3px outset grey;
}

::placeholder {
    font-size: larger;
}

.queries {
    align-self: center;
}

.queries span {
    font-size: x-large;
    font-weight: bolder;
    margin: 0 50px 0 50px;
}

button {
    height: 40px;
    width: 100px;
    font-size: larger;
    font-weight: bolder;
    border-radius: 5px;
    background: whitesmoke;
    color: black;
    margin: 10px 0 10px 0;
}

button:hover {
    background: black;
    color: whitesmoke;
    cursor: pointer;
}

.nearby-button {
    width: 300px;
    height: 40px;
}
.map-container {
    display: flex;
    height: 75%;
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
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 20px;
}

.no-results {
    padding: 20px;
}

.search-result:hover {
    cursor: pointer;
    background: rgba(27, 139, 87, 0.342);
}

.highlight {
    background: rgba(27, 139, 87, 0.342);
}

.map {
    height: 100%;
    width: 60%;
    justify-self: right;
}

.info-window-content {
    padding: 10px;
    background: rgba(27, 139, 87, 0.342);
    border-radius: 10px;
    font-family: "Lato", sans-serif;
}

.info-window-content h1 {
    font-size: x-large;
}

.info-window-content h3 {
    margin: 5px 0 5px 0;
}

.info-window-content a {
    color: black;
}

.dynamic-content h2 {
    margin-bottom: 10px;
}

.open {
    color: green;
}

.restricted {
    color: coral;
}

.closed {
    color: red;
}

hr {
    height: 3px;
}
</style>
