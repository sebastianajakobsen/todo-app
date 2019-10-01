<template>

</template>
<script>
    export default {
        created() {

            this.$store.dispatch('clearTodos')
            this.$store.dispatch('clearUser')
            this.$store.dispatch('logoutUser')
                .then(response => {
                    this.$router.push({name:'frontpage'})
                })
        }
    }
</script>
