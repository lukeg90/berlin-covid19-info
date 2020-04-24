<template>
    <div class="map-container">
        <form>
            <input
                type="text"
                id="mapquery"
                placeholder="Search for place"
                v-model="searchQuery"
            />
            <button @click.prevent="search">Submit</button>
        </form>
        <div class="map"></div>
    </div>
</template>

<script>
import googleInit from "../utils/gmaps";
import axios from "axios";
export default {
    name: "Map",
    data: () => {
        return {
            searchQuery: ""
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
        search: function() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/place/${this.searchQuery}`)
                .then(response => {
                    console.log("Search data: ", response.data.places);
                    this.searchQuery = "";
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
