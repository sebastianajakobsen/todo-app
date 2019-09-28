<template>
    <div class="w-1/3 mx-auto">

        <div class="bg-green-400 p-2 ">
            <h1>Todo</h1>
        </div>


        <div class="my-2">
            <input class="border border-blue-400 p-2 w-full" type="text" v-model="newTodo" @keyup.enter="addTodo">
        </div>

        <div class="p-2" v-for="todo in allTodos" :key="todo.id">
            {{todo.title}}
        </div>
    </div>
</template>

<script>
    export default {
        name:'todo',

        data(){
            return {
                newTodo:'',
            }
        },

        computed: {
            allTodos() {
                return this.$store.getters.allTodos;
            }
        },

        methods: {
            addTodo() {
                if (this.newTodo.trim().length == 0) {
                    return
                }
                this.$store.dispatch('addTodo', {
                    id: this.$store.getters.todosCount+1,
                    title: this.newTodo,
                })
                this.newTodo = ''
            },
        },

        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
