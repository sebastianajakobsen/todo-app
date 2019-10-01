<template>
    <div class="w-1/4 mx-auto">
        <h1 class="text-center text-3xl">Register</h1>
        <div class="p-2">
            <form action="#" @submit.prevent="registerUser">
                <label for="username">Username</label>
                <input name="username" type="text" class="w-full border border-blue-400 p-2 mb-2" placeholder="Username"
                       v-model="name">

                <label for="email">Email</label>
                <input name="email" type="text" class="w-full border border-blue-400 p-2 mb-2" placeholder="Email"
                       v-model="email">

                <label for="password">Password</label>
                <input name="password" type="password" class="w-full border border-blue-400 p-2 mb-2"
                       placeholder="Password" v-model="password">

                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    Create account
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Register',
        data() {
            return {
                name: '',
                email: '',
                password: '',

            }
        },

        methods: {
            registerUser() {
                this.$store.dispatch('registerUser', {
                    name:this.name,
                    email:this.email,
                    password:this.password
                })
                    .then(response => {
                        this.$router.push({name:'login'})
                    })
            }
        }

    }
</script>
