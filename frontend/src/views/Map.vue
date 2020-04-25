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
                placeholder="Search for a type of place"
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
            markers: []
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
        } catch (err) {
            console.log("error intializing google maps API: ", err);
        }
    },
    methods: {
        setMapOnAll: function(map) {
            this.markers.forEach(marker => marker.setMap(map));
        },
        clearMarkers: function() {
            this.setMapOnAll(null);
        },
        showMarkers: function() {
            this.setMapOnAll(this.map);
        },
        deleteMarkers: function() {
            this.clearMarkers();
            this.markers = [];
        },
        addMarkers: function(places) {
            let infowindow = new google.maps.InfoWindow();
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
        placeSearch: function() {
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
        textSearch: function() {
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
        getPlaceDetails: function(place) {
            // pan to location, set zoom
            console.log("place: ", place.name);
            this.map.panTo(place.geometry.location);
            let infowindow = new google.maps.InfoWindow();
            // this.map.setZoom(16);
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
                    let markerMatch = this.markers.find(
                        marker =>
                            marker.position.lat() ==
                                this.placeDetails.geometry.location.lat &&
                            marker.position.lng() ==
                                this.placeDetails.geometry.location.lng
                    );
                    console.log("marker match found? ", markerMatch);
                    infowindow.setContent(
                        `<div><strong>${this.placeDetails.name}</strong></div>`
                    );
                    infowindow.open(this.map, markerMatch);
                    // call backend
                })
                .catch(err => {
                    console.log("Error getting place details: ", err);
                });
        }
    }
};
</script>

<style scoped>
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
</style>
