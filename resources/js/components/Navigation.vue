<template>
    <div>
        <ul>
            <li>
                <router-link :to="{ name: 'frontpage'}">Frontpage</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'todo'}">Todo</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name:'navigation',
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
