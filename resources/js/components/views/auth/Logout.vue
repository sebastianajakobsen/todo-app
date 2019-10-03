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

                    this.$toasted.show('User is logged out', {
                        theme: "toasted-primary",
                        type : 'success',
                        position: "bottom-right",
                        action : {
                            text : 'X',
                            onClick : (e, toastObject) => {
                                toastObject.goAway(0);
                            }
                        },
                        duration : 5000,
                    });

                })


                .catch(error => {
                    this.$router.push({name:'frontpage'})
                })
        }
    }
</script>
