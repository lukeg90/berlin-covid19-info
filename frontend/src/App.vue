<template>
    <div id="app" @click="showStats = false">
        <div id="nav">
            <div class="nav-center">
                <router-link to="/" @click.native.stop="showStats = true"
                    >Home</router-link
                >
                <router-link to="/map">Map</router-link>
                <a
                    href="javascript:void(0)"
                    @click.stop="showStats = !showStats"
                    >Stats</a
                >
            </div>
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
            showStats: true
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
    height: 100vh;
    width: 100vw;
}

#nav {
    width: 100%;
    height: 10%;
    background: whitesmoke;
    top: 0;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-center {
    display: flex;
    width: 50%;
    justify-content: space-evenly;
}

#nav a {
    font-weight: bold;
    text-decoration: none;
    color: #001f3f;
}

#nav a.router-link-exact-active {
    color: slategray;
}
</style>
