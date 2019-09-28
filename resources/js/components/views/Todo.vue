<template>
    <div>
        <h1>Todo</h1>
        <div v-for="todo in allTodos" :key="todo.id">
            {{todo.title}}
        </div>
    </div>
</template>

<script>
    export default {
        name:'todo',

        computed: {
            allTodos() {
                return this.$store.getters.allTodos;
            }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
