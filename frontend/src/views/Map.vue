<template>
    <div>
        <form>
            <input
                type="text"
                id="mapquery"
                placeholder="Search for place"
                v-model="placeSearchQuery"
            />
            <button @click.prevent="placeSearch">Submit</button>
        </form>
        <div class="map-container">
            <div class="search-results-container">
                <div
                    class="search-result"
                    v-for="result in placeSearchResults"
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
            placeSearchResults: []
        };
    },
    async mounted() {
        try {
            const google = await googleInit();
            // const geocoder = new google.maps.Geocoder();
            const map = new google.maps.Map(document.querySelector(".map"), {
                center: { lat: 52.52, lng: 13.405 },
                zoom: 11,
                streetViewControl: false
                // zoomControl: false,
                // scrollwheel: false,
                // scaleControl: false,
                // gestureHandling: "none",
            });
            // prevent user zooming out of Berlin
            map.setOptions({ minZoom: 11 });
            this.map = map;
        } catch (err) {
            console.log("error intializing google maps API: ", err);
        }
    },
    methods: {
        placeSearch: function() {
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/place/${this.placeSearchQuery}`
                )
                .then(({ data }) => {
                    console.log("Search data: ", data.places);
                    // add results to search results div
                    this.placeSearchResults = data.places;
                    // add markers to map?
                    data.places.forEach(place => {
                        let marker = new google.maps.Marker({
                            position: place.geometry.location,
                            map: this.map
                        });
                    });
                    this.placeSearchQuery = "";
                })
                .catch(err => {
                    console.log("Error in place search: ", err);
                });
        },
        getPlaceDetails: function(place) {
            // pan to location, set zoom
            // call backend
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
