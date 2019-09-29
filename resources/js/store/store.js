import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)
export default new Vuex.Store({

    // State
    // Vuex uses a single state tree - that is, this single object contains all your application level state and serves as the "single source of truth".
    // This also means usually you will have only one store for each application.
    // A single state tree makes it straightforward to locate a specific piece of state, and allows us to easily
    // take snapshots of the current app state for debugging purposes.
    state: {

        filter: 'all',
        todos: [
            {
                'id': 1,
                'title': 'First todo',
                'completed': false,
            },
            {
                'id': 2,
                'title': 'Take over the world',
                'completed': false,
            },
            {
                'id': 3,
                'title': 'Code every day',
                'completed': true,
            },
        ]

    },

    // Getters
    // Sometimes we may need to compute derived state based on store state,
    // for example filtering through a list of items and counting them:
    getters: {
        todosFiltered(state) {
            if (state.filter == 'all') {
                return state.todos
            } else if (state.filter == 'active') {
                return state.todos.filter(todo => !todo.completed)
            } else if (state.filter == 'completed') {
                return state.todos.filter(todo => todo.completed)
            }
            return state.todos
        },

        filter(state){
            return state.filter
        },

        showClearCompletedButton(state) {
            return state.todos.filter(todo => todo.completed).length > 0
        },


        remaining(state) {
            return state.todos.filter(todo => !todo.completed).length;
        },

        anyRemaining(state, getters) {
            return getters.remaining != 0
        },

    },

    // Mutations
    // The only way to actually change state in a Vuex store is by committing a mutation.
    // Vuex mutations are very similar to events: each mutation has a string type and a handler.
    // The handler function is where we perform actual state modifications,
    // and it will receive the state as the first argument:
    mutations: {
        addTodo(state, todo) {
            state.todos.push(
                {
                    id: todo.id,
                    title: todo.title,
                    completed: false,
                    editing: false
                }
            );
        },

        updateFilter(state, filter) {
            state.filter = filter;
        },

        updateTodo(state, todo) {
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1, {
                'id': todo.id,
                'title': todo.title,
                'completed': todo.completed,
                'editing': todo.editing,
            })
        },


        deleteTodo(state, todo) {
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1)
        },

        checkAll(state, checked) {
            state.todos.forEach(todo => (todo.completed = checked))
        },
        removeCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed)
        },
    },

    // Actions
    // Actions are similar to mutations, the differences being that:
    //  * Instead of mutating the state, actions commit mutations.
    //  * Actions can contain arbitrary asynchronous operations.
    actions: {

        addTodo(context, todo) {
            context.commit('addTodo', todo)
        },

        deleteTodo(context, todo) {
            context.commit('deleteTodo', todo)
        },


        updateTodo(context, todo) {
            context.commit('updateTodo', todo)

            // axios.patch('/todos/' + todo.id, {
            //     title: todo.title,
            //     completed: todo.completed,
            // })
            //     .then(response => {
            //         context.commit('updateTodo', response.data)
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
        },

        updateFilter(context, filter) {

            context.commit('updateFilter', filter)

        },

        checkAll(context, checked) {
            // axios.patch('/todosCheckAll', {
            //     completed: checked,
            // })
            //     .then(response => {
            //         context.commit('checkAll', checked)
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })

            context.commit('checkAll', checked)
        },

        removeCompleted(context) {
            // const completed = context.state.todos
            //     .filter(todo => todo.completed)
            //     .map(todo => todo.id)
            // axios.delete('/todosDeleteCompleted', {
            //     data: {
            //         todos: completed
            //     }
            // })
            //     .then(response => {
            //         context.commit('clearCompleted')
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
            context.commit('removeCompleted')
        }
    }
})
