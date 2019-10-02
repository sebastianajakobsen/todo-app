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
        user: JSON.parse(localStorage.getItem('user_traits')) || null,
        todos: [],

    },

    // Getters -> filter of local data
    // Sometimes we may need to compute derived state based on store state,
    // for example filtering through a list of items and counting them:
    // Start from is when returns Boolean, or get otherwise
    getters: {

        // Check to see if user is logged in
        isUserLoggedIn(state) {
            return state.access_token !== null
        },

        // get user
        getUser(state) {
            return state.user
        },


        getTodosFiltered(state) {
            if (state.filter == 'all') {
                return state.todos
            } else if (state.filter == 'active') {
                return state.todos.filter(todo => !todo.completed)
            } else if (state.filter == 'completed') {
                return state.todos.filter(todo => todo.completed)
            }
            return state.todos
        },

        getFilter(state) {
            return state.filter
        },

        isAnyTodoCompleted(state) {
            return state.todos.filter(todo => todo.completed).length > 0
        },


        getRemainingTodos(state) {
            return state.todos.filter(todo => !todo.completed).length;
        },

        isAnyRemaining(state, getters) {
            return getters.getRemainingTodos != 0
        },

    },

    // Mutations -> local data
    // The only way to actually change state in a Vuex store is by committing a mutation.
    // Vuex mutations are very similar to events: each mutation has a string type and a handler.
    // The handler function is where we perform actual state modifications,
    // and it will receive the state as the first argument:
    mutations: {
        ADD_TODO(state, todo) {
            state.todos.push(
                {
                    id: todo.id,
                    title: todo.title,
                    completed: false,
                    editing: false
                }
            );
        },

        SET_CURRENT_FILTER(state, filter) {
            state.filter = filter;
        },

        SET_UPDATED_TODO(state, todo) {
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1, {
                'id': todo.id,
                'title': todo.title,
                'completed': todo.completed,
                'editing': todo.editing,
            })
        },


        REMOVE_TODO(state, todo) {
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1)
        },

        SET_CHECK_ALL(state, checked) {
            state.todos.forEach(todo => (todo.completed = checked))
        },

        REMOVE_COMPLETED_TODOS(state) {
            state.todos = state.todos.filter(todo => !todo.completed)
        },

        ADD_FETCHED_TODOS(state, data) {
            state.todos = data;
        },

        ADD_ACCESS_TOKEN(state, token) {
            state.access_token = token;
        },

        REMOVE_ACCESS_TOKEN(state) {
            state.access_token = null;
        },

        REMOVE_AUTH_USER(state) {
            state.user = null;
        },

        REMOVE_ALL_TODOS(state) {
            state.todos = [];
        },

        ADD_AUTH_USER(state, user) {
            state.user = user;
        }

    },

    // Actions -> database data
    // Actions are similar to mutations, the differences being that:
    //  * Instead of mutating the state, actions commit mutations.
    //  * Actions can contain arbitrary asynchronous operations.
    // Almost every action should return promise.
    // We allow you to replicate conventions for existing methods like list or single in new modules to have a consistent API.
    actions: {

        fetchTodos(context) {

            axios.get('/api/todos')
                .then(response => {
                    context.commit('ADD_FETCHED_TODOS', response.data)
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
                    context.commit('ADD_TODO', response.data)
                })
                .catch(error => {

                    console.log(error)
                })

        },

        deleteTodo(context, todo) {

            axios.delete('/api/todos/' + todo.id)
                .then(response => {
                    context.commit('REMOVE_TODO', todo)
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
                    context.commit('SET_UPDATED_TODO', response.data)
                })
                .catch(error => {
                    console.log(error)
                })

        },

        updateFilter(context, filter) {
            context.commit('SET_CURRENT_FILTER', filter)
        },

        checkAll(context, checked) {

            axios.patch('/api/todosCheckAll', {
                completed: checked,
            })
                .then(response => {
                    context.commit('SET_CHECK_ALL', checked)
                })
                .catch(error => {
                    console.log(error)
                })
        },

        removeCompleted(context) {

            // Mass delete all completed todos
            axios.delete('/api/todosDeleteCompleted')
                .then(response => {
                    context.commit('REMOVE_COMPLETED_TODOS')
                })
                .catch(error => {
                    console.log(error)
                })


        },

        loginUser(context, credentials) {

            // Promise for letting the parent know if
            // it got resolve or rejectet
            // if resolve then login compontent will redirect user
            return new Promise((resolve, reject) => {

                axios.post('/api/login', {
                    username: credentials.username,
                    password: credentials.password
                })
                    .then(response => {

                        const token = response.data.access_token;
                        localStorage.setItem('access_token', token)
                        context.commit('ADD_ACCESS_TOKEN', token)
                        resolve(response)
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error)
                    })
            })
        },



        logoutUser(context) {

            // if user is logged in
            if (context.getters.isUserLoggedIn) {
                // make new promise -> if resolve then logout components will redirect
                return new Promise((resolve, reject) => {
                    axios.post('/api/logout')
                        .then(response => {
                            localStorage.removeItem('access_token')
                            localStorage.removeItem('user_traits')
                            context.commit('REMOVE_ACCESS_TOKEN')
                            context.commit('REMOVE_AUTH_USER')
                            context.commit('REMOVE_ALL_TODOS')
                            resolve(response)

                        })
                        // if errors -> then still remove all auth data from Localstorage and State -> logging out the Fronted user
                        // Don't want a rogue user that dosnt exist in the Database to be loggedin!
                        .catch(error => {
                            localStorage.removeItem('access_token')
                            localStorage.removeItem('user_traits')
                            context.commit('REMOVE_ACCESS_TOKEN')
                            context.commit('REMOVE_AUTH_USER')
                            context.commit('REMOVE_ALL_TODOS')
                            reject(error)
                        })
                })
            }
        },

        registerUser(context, data) {
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
                        reject(error)
                    })
            })
        },

        getUserInformation(context) {
            return new Promise((resolve, reject) => {
            axios.get('/api/user')
                .then(response => {
                    localStorage.setItem('user_traits', JSON.stringify(response.data))
                    context.commit('ADD_AUTH_USER', response.data)
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }

    }
})
