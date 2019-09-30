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

        <div class="p-2 flex" v-for="todo in todosFiltered" :key="todo.id">
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
                <input type="checkbox" :checked="!anyRemaining" @change="allChecked"> Check all
            </div>
            <div>
                {{remaining}} items left
            </div>
        </div>

        <div class="flex justify-between" >
            <div class="flex">
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':filter == 'all'}"
                            @click="updateFilter('all')">All
                    </button>
                </div>
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':filter == 'active'}"
                            @click="updateFilter('active')">Active
                    </button>
                </div>
                <div class="m-2">
                    <button class="p-2 bg-gray-400 hover:bg-green-400"
                            :class="{'bg-green-400 border-2 border-blue-800':filter == 'completed'}"
                            @click="updateFilter('completed')">Completed
                    </button>
                </div>
            </div>

            <div v-if="showClearCompletedButton">
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
        name: 'todo',

        data() {
            return {
                editedTodo: null,
                newTodo: '',
            }
        },

        created() {
            // get all todos on
            this.$store.dispatch('getTodos')
        },

        computed: {

            showClearCompletedButton() {
                return this.$store.getters.showClearCompletedButton
            },

            filter() {
                return this.$store.getters.filter
            },

            todosFiltered() {
                return this.$store.getters.todosFiltered;
            },
            remaining() {
                return this.$store.getters.remaining;
            },
            anyRemaining() {
                return this.$store.getters.anyRemaining;
            },

        },

        methods: {

            removeCompleted() {
                this.$store.dispatch('removeCompleted')
            },

            allChecked() {
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
