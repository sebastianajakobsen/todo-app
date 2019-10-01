<template>
    <div>
            <nav-bar></nav-bar>
            <router-view></router-view>
    </div>
</template>

<script>
    import NavBar from "./components/NavBar";
    export default {
        components: {NavBar},
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
