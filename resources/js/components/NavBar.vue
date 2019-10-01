<template>
    <div class="bg-green-500 border-b-4 border-blue-800 mb-4">
        <nav class="flex list-none p-4 justify-between m-0 text-white">
            <div class="flex">
                <li class="px-5">
                    <router-link :to="{ name: 'frontpage'}">Frontpage</router-link>
                </li>
                <li class="px-5">
                    <router-link :to="{ name: 'todolist'}">Todo</router-link>
                </li>
            </div>

            <div class="flex" v-if="!isUserLoggedIn">
                <li class="px-5">
                    <router-link :to="{ name: 'login'}">Login</router-link>
                </li>
                <li class="px-5">
                    <router-link :to="{ name: 'register'}">Register</router-link>
                </li>
            </div>

            <div class="flex" v-else>
                <li class="px-5">
                    <router-link :to="{ name: 'logout'}">Logout <span v-if="getUser">{{getUser.name}}</span></router-link>
                </li>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name:'NavBar',
        computed: {
            isUserLoggedIn() {
                return this.$store.getters.isUserLoggedIn;
            },
            getUser() {
                return this.$store.getters.getUser;
            }
        }
    }
</script>
