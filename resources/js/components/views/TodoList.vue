<template>
    <div class="w-1/3 mx-auto p-2 bg-gray-200">

        <div class="bg-green-500 p-2 border-b-4 border-blue-800 ">
            <h1 class="text-3xl text-center text-white font-bold">Todo</h1>
        </div>


        <div class="my-2">
            <input class="border border-blue-800 p-2 w-full"
                   type="text"
                   v-model="newTodo"
                   @keyup.enter="addTodo"
                   placeholder="Write todo">
        </div>

        <div class="p-2 flex" v-for="todo in getTodosFiltered" :key="todo.id">
            <div class="m-2">
                <input class="p-2" type="checkbox"
                       v-model="todo.completed"
                       @change="updateTodo(todo)">
            </div>

            <div v-if="editedTodo !== todo" class="flex-grow mx-2 p-2"
                 :class="{'line-through':todo.completed}"
                 @dblclick="editTodo(todo)">
                {{todo.title}}
            </div>

            <div v-else class="flex-grow mx-2">
                <input class="w-full border border-blue-400 p-2" type="text"
                       @blur="cancelEdit(todo)"
                       @keyup.enter="updateTodo(todo)"
                       @keyup.esc="cancelEdit(todo)"
                       v-model="todo.title"
                       v-focus>
            </div>

            <div class="m-2">
                <span class="cursor-pointer p-2" @click="deleteTodo(todo)">&times;</span>
            </div>
        </div>

        <div class="flex justify-between my-2  border-b-2 border-t-2 p-2">
            <div>
                <input type="checkbox" :checked="!isAnyRemaining" @change="checkAll"> Check all
            </div>
            <div>
                {{getRemainingTodos}} items left
            </div>
        </div>

        <div class="flex justify-between" >
            <div class="flex">
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':getFilter == 'all'}"
                            @click="updateFilter('all')">All
                    </button>
                </div>
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':getFilter == 'active'}"
                            @click="updateFilter('active')">Active
                    </button>
                </div>
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':getFilter == 'completed'}"
                            @click="updateFilter('completed')">Completed
                    </button>
                </div>
            </div>

            <div v-if="isAnyTodoCompleted">
                <div class="m-2">
                    <button  class="p-2 bg-gray-400 hover:bg-green-400"

                            @click="removeCompleted('completed')">Clear Completed
                    </button>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
    export default {
        name: 'TodoList',

        data() {
            return {
                editedTodo: null,
                newTodo: '',
            }
        },

        created() {
            // get all todos on
            this.$store.dispatch('fetchTodos')
        },

        computed: {

            isAnyTodoCompleted() {
                return this.$store.getters.isAnyTodoCompleted
            },

            getFilter() {
                return this.$store.getters.getFilter
            },

            getTodosFiltered() {
                return this.$store.getters.getTodosFiltered;
            },
            getRemainingTodos() {
                return this.$store.getters.getRemainingTodos;
            },
            isAnyRemaining() {
                return this.$store.getters.isAnyRemaining;
            },

        },

        methods: {

            removeCompleted() {
                this.$store.dispatch('removeCompleted')
            },

            checkAll() {
                this.$store.dispatch('checkAll', event.target.checked)
            },

            addTodo() {
                if (this.newTodo.trim().length == 0) {
                    return
                }
                this.$store.dispatch('addTodo', {
                    title: this.newTodo,
                })

                this.newTodo = ''
            },

            updateFilter(filter) {
                this.$store.dispatch('updateFilter', filter);
            },

            updateTodo(todo) {
                this.editedTodo = null;

                if (todo.title.trim() == '') {
                    todo.title = todo.beforeEditCache
                }

                this.$store.dispatch('updateTodo', {
                    'id': todo.id,
                    'title': todo.title,
                    'completed': todo.completed,
                })
            },

            deleteTodo(todo) {
                this.$store.dispatch('deleteTodo', todo)
            },

            editTodo(todo) {
                this.editedTodo = todo;
                todo.beforeEditCache = todo.title

            },
            cancelEdit(todo) {
                this.editedTodo = null;
                todo.title = todo.beforeEditCache;
            }
        },

        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
