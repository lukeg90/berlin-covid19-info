<template>
    <div id="app" @click="showStats = false">
        <div id="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/map">Map</router-link>
            <a href="javascript:void(0)" @click.stop="showStats = !showStats"
                >Stats</a
            >
        </div>
        <CovidStats :show="showStats" />
        <router-view />
    </div>
</template>

<script>
import axios from "axios";
import CovidStats from "@/components/CovidStats.vue";
export default {
    components: {
        CovidStats
    },
    data: () => {
        return {
            showStats: false
        };
    }
};
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
}

#app {
    font-family: "Lato", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#nav {
    width: 100vw;
    padding: 30px;
    background: whitesmoke;
    text-align: center;
}

#nav a {
    font-weight: bold;
    text-decoration: none;
    color: black;
    padding: 30px;
}

#nav a.router-link-exact-active {
    color: slategray;
}
</style>
