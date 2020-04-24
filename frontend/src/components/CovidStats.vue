<template>
    <transition name="slide">
        <div class="stats" v-if="show">
            <h3>
                Total Cases: <span v-if="stats">{{ stats.count }}</span>
                <span v-else style="font-size: small"
                    >Waiting for update...</span
                >
            </h3>
            <h3>
                Deaths: <span v-if="stats">{{ stats.deaths }}</span>
                <span v-else style="font-size: small"
                    >Waiting for update...</span
                >
            </h3>
        </div>
    </transition>
</template>

<script>
import axios from "axios";

export default {
    name: "CovidStats",
    props: ["show"],
    data: () => {
        return {
            stats: {}
        };
    },
    mounted() {
        axios
            .get(`${process.env.VUE_APP_API_URL}/covid-stats`)
            .then(response => {
                console.log("RKI data: ", response.data);
                this.stats = response.data.berlinStats;
            })
            .catch(err => {
                console.log("error getting data from RKI", err);
            });
    }
};
</script>

<style scoped>
.stats {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 35%;
    width: 35%;
    background: black;
    z-index: 1;
}

.animate {
    transition-property: transform;
    transform: translateX(100%);
}
.stats h3 {
    font-size: 40px;
    color: whitesmoke;
}

.slide-enter-active {
    animation: slide-in 1s ease-out forwards;
}

.slide-leave-active {
    animation: slide-out 1s ease-out forwards;
}

@keyframes slide-in {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-out {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}
</style>
