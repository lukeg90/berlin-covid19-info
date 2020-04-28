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
    height: 90%;
    width: 100%;
}
.jumbotron {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
    z-index: -1;
}
.title {
    position: absolute;
    right: 250px;
    top: 250px;
    width: 500px;
    height: 400px;
}
.title h1 {
    font-size: 100px;
    color: #ffdc00;
}
</style>
