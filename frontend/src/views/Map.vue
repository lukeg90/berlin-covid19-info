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
            <div class="search-results"></div>
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
            placeSearchQuery: ""
        };
    },
    async mounted() {
        try {
            const google = await googleInit();
            // const geocoder = new google.maps.Geocoder();
            const map = new google.maps.Map(document.querySelector(".map"), {
                center: { lat: 52.52, lng: 13.405 },
                zoom: 11,
                zoomControl: false,
                scrollwheel: false,
                scaleControl: false,
                gestureHandling: "none",
                streetViewControl: false
            });
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
                .then(response => {
                    console.log("Search data: ", response.data.places);
                    this.placeSearchQuery = "";
                })
                .catch(err => {
                    console.log("Error in place search: ", err);
                });
        }
    }
};
</script>

<style scoped>
.map-container {
    display: flex;
    justify-content: right;
    height: 100%;
    width: 100%;
}
.map {
    height: 700px;
    width: 700px;
}
</style>
