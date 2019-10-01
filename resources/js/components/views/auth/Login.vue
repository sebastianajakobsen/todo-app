<template>
    <div class="w-1/4 mx-auto">
        <h1 class="p-2 ">Login</h1>

        <div class="p-2">
            <form action="#" @submit.prevent="login">
                <label for="username">Username</label>
                <input name="username" type="text" class="w-full border border-blue-400 p-2 mb-2" placeholder="Username"
                       v-model="username">
                <label for="password">Password</label>
                <input name="password" type="password" class="w-full border border-blue-400 p-2 mb-2"
                       placeholder="Password" v-model="password">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    submit
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                username: '',
                password: ''
            }
        },

        methods: {
            login() {
                this.$store.dispatch('login', {
                    username:this.username,
                    password:this.password
                })
                    .then(response => {
                        this.$router.push({name:'todo'})
                    })
            }
        }
    }
</script>
