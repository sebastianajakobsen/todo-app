<template>

</template>
<script>
    export default {
        name:'logout',
        created() {

            console.log('User is loggin out. Come back soon :)')
            // both on successfully and error will logout the user in the frontend part of the app
            // and redirect to frontpage
            this.$store.dispatch('logoutUser')
                .then(response => {
                    this.$router.push({name:'frontpage'})
                })
                .catch(error => {
                    this.$router.push({name:'frontpage'})
                })
        }
    }
</script>
