<template>
    <div>
        <div class="header">
            <h1>Where Can I Go?</h1>
            <h2>
                Berlin is slowly coming back to life. Check the map to see
                what's opening back up and what's still restricted.
            </h2>
            <form>
                <!-- <input
                    type="text"
                    id="placeSearch"
                    placeholder="Search for a specific place"
                    v-model="placeSearchQuery"
                />
                <button @click.prevent="placeSearch">Submit</button> -->
                <input
                    type="text"
                    id="textSearch"
                    placeholder="Search for a place"
                    v-model="textSearchQuery"
                />
                <button @click.prevent="textSearch">Search</button>
            </form>
        </div>
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
import getInfoWindowContent from "../utils/info-window-content";
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
        // placeSearch() {
        //     this.deleteMarkers();
        //     axios
        //         .get(
        //             `${process.env.VUE_APP_API_URL}/place/specific/${this.placeSearchQuery}`
        //         )
        //         .then(({ data }) => {
        //             console.log("Place search data: ", data.places);
        //             // add results to search results div
        //             this.searchResults = data.places;
        //             // add markers to map?
        //             this.addMarkers(this.searchResults);
        //             this.placeSearchQuery = "";
        //         })
        //         .catch(err => {
        //             console.log("Error in place search: ", err);
        //         });
        // },
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
.header {
    display: flex;
    height: 150px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

input[type="text"] {
    border-radius: 5px;
    font-size: larger;
    outline: none;
    height: 40px;
    width: 300px;
    margin: 5px;
}

input[type="text"]:focus {
    border: 3px outset grey;
}

::placeholder {
    font-size: larger;
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

form {
}

.map-container {
    display: flex;
    height: 500px;
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

.restricted {
    color: orange;
}

.closed {
    color: red;
}
</style>
