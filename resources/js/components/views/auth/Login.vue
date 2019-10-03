<template>
    <div class="w-1/4 mx-auto p-2 bg-white mt-32">

        <h1 class="p-2 text-3xl font-bold text-center">Login</h1>
        <div class="p-2">


            <div v-if="successMessage" class="text-green-600 bg-green-200 text-lg py-2 px-4 rounded mb-4">
                {{successMessage}}
            </div>

            <div v-if="serverErrors" class="text-red-600 bg-red-200 text-lg py-2 px-4 rounded mb-4">
                {{serverErrors}}
            </div>

            <ValidationObserver v-slot="{ passes }">

                <form action="#" @submit.prevent="passes(loginUser)">

                    <ValidationProvider name="username" rules="required" v-slot="{ errors }">
                        <label class="text-lg"  for="username">Username</label>

                        <input name="username" type="text" class="w-full border-2 p-2 mb-2" :class="{'border-red-600':errors[0]}"
                               placeholder="Username"
                               v-model="username">
                        <span class="text-red-600 block mb-2">{{ errors[0] }}</span>
                    </ValidationProvider>

                    <ValidationProvider name="password" rules="required" v-slot="{ errors }">
                        <label class="text-lg"  for="password">Password</label>
                        <input name="password" type="password" class="w-full border-2 p-2 mb-2" :class="{'border-red-600':errors[0]}"
                               placeholder="Password" v-model="password" >
                        <span class="text-red-600 block mb-2">{{ errors[0] }}</span>
                    </ValidationProvider>

                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                        <div v-if="isLoading" class="lds-ring text-lg"><div></div><div></div><div></div><div></div></div> submit
                    </button>

                </form>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
    import {ValidationObserver, ValidationProvider} from "vee-validate";

    export default {
        name: 'Login',
        props:{
            dataSuccessMessage:String,
        },
        components: {
            ValidationObserver,
            ValidationProvider
        },
        data() {
            return {
                username: '',
                password: '',
                serverErrors: '',
                successMessage: this.dataSuccessMessage,
            }
        },

        computed: {
          isLoading() {
              return this.$store.getters.isLoading
          }
        },

        methods: {
            loginUser() {
                this.$store.dispatch('loginUser', {
                    username: this.username,
                    password: this.password
                })
                    .then(response => {
                        this.$store.dispatch('getUserInformation')
                            .then(response => {
                                this.$router.push({name: 'todolist'})
                            });

                        // display toast on success
                        this.$toasted.show('Authenticated!', {
                            theme: "toasted-primary",
                            type : 'success',
                            position: "bottom-right",
                            action : [
                                {
                                    text : 'Frontpage',
                                    // router navigation
                                    push : {
                                        name : 'frontpage',
                                        // this will prevent toast from closing
                                        // dontClose : true
                                    }
                                },
                                {
                                    text : 'Logout',
                                    // router navigation
                                    push : {
                                        name : 'logout',
                                        // this will prevent toast from closing
                                        // dontClose : true
                                    }
                                }
                            ],
                            duration : 5000,
                        });
                    })



                    .catch(error => {
                        this.serverErrors = error.response.data.message
                        this.password = '';
                        this.successMessage = '';
                    })


            }
        }
    }
</script>
