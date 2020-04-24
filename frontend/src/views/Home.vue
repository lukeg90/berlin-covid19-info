<template>
    <div class="home">
        <img
            src="../assets/jumbotron.jpg"
            alt="empty-hauptbahnhof"
            class="jumbotron"
        />
        <div class="title"><h1>COVID-19 Information Berlin</h1></div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: "Home"
};
</script>

<style scoped>
.home {
    position: relative;
    height: 100%;
    width: 100%;
}
.jumbotron {
    position: fixed;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    z-index: -1;
}
.title {
    position: absolute;
    right: 100px;
    top: 100px;
    width: 500px;
    height: 500px;
}
.title h1 {
    font-size: 100px;
    color: black;
}
</style>
