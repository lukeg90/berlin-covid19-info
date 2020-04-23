<template>
    <div class="map"></div>
</template>

<script>
import googleInit from "../utils/gmaps";
export default {
    name: "Map",
    async mounted() {
        try {
            const google = await googleInit();
            const geocoder = new google.maps.Geocoder();
            const map = new google.maps.Map(this.$el, {
                zoomControl: false,
                scrollwheel: false,
                scaleControl: false,
                gestureHandling: "none",
                streetViewControl: false
            });
            geocoder.geocode({ address: "Berlin" }, (results, status) => {
                console.log("Geocode results: ", results);
                console.log("Geocode status: ", status);
                if (status !== "OK" || !results[0]) {
                    throw new Error(status);
                }
                map.setCenter(results[0].geometry.location);
                map.fitBounds(results[0].geometry.viewport);
            });
        } catch (err) {
            console.log("error intializing google maps API: ", err);
        }
    }
};
</script>

<style scoped>
.map {
    width: 100vw;
    height: 80vh;
}
</style>
