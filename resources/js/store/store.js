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
        access_token: localStorage.getItem('access_token') || null,
        filter: 'all',
        todos: [],

    },

    // Getters -> filter of local data
    // Sometimes we may need to compute derived state based on store state,
    // for example filtering through a list of items and counting them:
    getters: {

        // Check to see if user is logged in
        loggedIn(state) {
          return state.access_token !== null
        },

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

        filter(state) {
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

    // Mutations -> local data
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

        getTodos(state, data) {
            state.todos = data;
        },

        login(state, token) {
            state.access_token = token;
        },

        logout(state) {
            state.access_token = null;
        }

    },

    // Actions -> database data
    // Actions are similar to mutations, the differences being that:
    //  * Instead of mutating the state, actions commit mutations.
    //  * Actions can contain arbitrary asynchronous operations.
    actions: {



        getTodos(context) {
            axios.get('/api/todos')
                .then(response => {
                    context.commit('getTodos', response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },

        addTodo(context, todo) {

            axios.post('/api/todos', {
                title: todo.title,
                completed: false
            })
                .then(response => {
                    context.commit('addTodo', response.data)
                })
                .catch(error => {
                    console.log(error)
                })

        },

        deleteTodo(context, todo) {
            axios.delete('/api/todos/' + todo.id)
                .then(response => {
                    context.commit('deleteTodo', todo)
                })
                .catch(error => {
                    console.log(error)
                })
        },


        updateTodo(context, todo) {
            axios.patch('/api/todos/' + todo.id, {
                title: todo.title,
                completed: todo.completed
            })
                .then(response => {
                    context.commit('updateTodo', response.data)
                })
                .catch(error => {
                    console.log(error)
                })

        },

        updateFilter(context, filter) {
            context.commit('updateFilter', filter)
        },

        checkAll(context, checked) {
            axios.patch('/api/todosCheckAll', {
                completed: checked,
            })
                .then(response => {
                    context.commit('checkAll', checked)
                })
                .catch(error => {
                    console.log(error)
                })

            context.commit('checkAll', checked)
        },

        removeCompleted(context) {

            // filter then once that are completed
            // map over each one of those and return their id's
            const completed = context.state.todos
                .filter(todo => todo.completed)
                .map(todo => todo.id)

            // mass delete by sending array of ids that should be deleted!
            axios.delete('/api/todosDeleteCompleted', {
                data: {
                    todos: completed
                }
            })
                .then(response => {
                    context.commit('removeCompleted')
                })
                .catch(error => {
                    console.log(error)
                })

        },

        login(context, credentials) {

            // Promise for letting the parent know if
            // it got resolve or rejectet
            // if resolve then login compontent will redirect user
            return new Promise((resolve, reject) => {

            axios.post('/api/login', {
                username: credentials.username,
                password: credentials.password
            })
                .then(response => {

                    const accessToken = response.data.access_token;
                    localStorage.setItem('access_token', accessToken)
                    context.commit('login', accessToken)
                    resolve(response)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        },

        logout(context) {
            // passing ind Auth header for access token.
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.access_token
            // if user is logged in
            if(context.getters.loggedIn){
                // make new promise -> if resolve then logout components will redirect
                return new Promise((resolve, reject) => {
                    axios.post('/api/logout')
                        .then(response => {
                            localStorage.removeItem('access_token')
                            context.commit('logout')
                            resolve(response)
                        })
                        .catch(error => {
                            localStorage.removeItem('access_token')
                            context.commit('logout')
                            reject(error)
                        })
                })
            }
        },

        register(context, data) {
            return new Promise((resolve, reject) => {

                axios.post('/api/register', {
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error)
                    })
            })
        }

    }
})
