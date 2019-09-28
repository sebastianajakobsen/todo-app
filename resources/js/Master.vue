<template>
    <div>
            <navigation></navigation>
            <router-view></router-view>
    </div>
</template>

<script>
    import Navigation from "./components/Navigation";
    export default {
        components: {Navigation},
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
