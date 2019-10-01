<template>

</template>
<script>
    export default {
        created() {

            this.$store.dispatch('clearTodos')
            this.$store.dispatch('logoutUser')
                .then(response => {
                    this.$router.push({name:'frontpage'})
                })
        }
    }
</script>
