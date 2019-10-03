<template>
    <div class="w-1/4 mx-auto p-2 bg-white mt-32">
        <h1 class="p-2 text-3xl font-bold">Register</h1>

        <div class="p-2">

            <div v-if="serverErrors" class="text-red-600 bg-red-200 text-lg py-2 px-4 rounded mb-4">
                <div v-for="(error, key) in serverErrors" :key="key">
                    {{error[0]}}
                </div>

            </div>

            <ValidationObserver v-slot="{ passes }">

                <form action="#" @submit.prevent="passes(registerUser)">

                    <ValidationProvider name="username" rules="required|alpha_num" v-slot="{ errors }">
                        <label class="text-lg" for="username">Username</label>
                        <input name="username" type="text" class="w-full border-2 p-2 mb-2"
                               :class="{'border-red-600':errors[0]}"
                               placeholder="username"
                               v-model="name">
                        <span class="text-red-600 block mb-2">{{ errors[0] }}</span>
                    </ValidationProvider>

                    <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                        <label class="text-lg" for="email">Email</label>
                        <input name="email" type="text" class="w-full border-2 p-2 mb-2"
                               :class="{'border-red-600':errors[0]}"
                               placeholder="Email"
                               v-model="email">
                        <span class="text-red-600 block mb-2">{{ errors[0] }}</span>
                    </ValidationProvider>

                    <ValidationProvider name="password" rules="required|min:8" v-slot="{ errors }" vid="password">
                        <label class="text-lg" for="password">Password</label>

                        <input name="password" type="password" class="w-full border-2 p-2 mb-2"
                               :class="{'border-red-600':errors[0]}"
                               placeholder="Password" v-model="password">
                        <span class="text-red-600 block mb-2">{{ errors[0] }}</span>
                    </ValidationProvider>

                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                        <div v-if="isLoading" class="lds-ring text-lg"><div></div><div></div><div></div><div></div></div> Create account
                    </button>
                </form>

            </ValidationObserver>
        </div>
    </div>
</template>

<script>
    import {ValidationObserver, ValidationProvider} from "vee-validate";

    export default {
        name: 'Register',
        components: {
            ValidationObserver,
            ValidationProvider
        },

        computed: {
            isLoading() {
                return this.$store.getters.isLoading
            }
        },

        data() {
            return {
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
                serverErrors: '',
                successMessage: ''
            }
        },

        methods: {
            registerUser() {
                this.$store.dispatch('registerUser', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                })
                    .then(response => {
                        this.successMessage = 'Registered Successfully'
                        this.$router.push({
                            name: 'login',
                            params: {
                                dataSuccessMessage: this.successMessage
                            }
                        })

                        this.$toasted.show('Registered Successfully', {
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
                        this.serverErrors = error.response.data.errors;
                        this.password = '';
                        this.passwordConfirm = '';

                        this.$toasted.show('Registration Failed!</br> Please fix your errors and try again.', {
                            theme: "toasted-primary",
                            type : 'error',
                            position: "bottom-right",
                            action : {
                                text : 'X',
                                onClick : (e, toastObject) => {
                                    toastObject.goAway(0);
                                }
                            },
                            duration : 7000,
                        });
                    })
            }
        }

    }
</script>
