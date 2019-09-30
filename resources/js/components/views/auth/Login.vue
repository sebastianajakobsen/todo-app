<template>
    <div class="w-1/4 mx-auto">
        <h1 class="p-2 ">Login</h1>

        <div class="p-2">
            <input type="text" class="w-full border border-blue-400 p-2 mb-2" placeholder="Username">
            <input type="password" class="w-full border border-blue-400 p-2 mb-2" placeholder="Password" >
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                submit
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name:'login',
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
