/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */


require('./bootstrap');


import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from "./store/store";
import "./vee-validate";
import Toasted from 'vue-toasted';


Vue.use(VueRouter)


const router = new VueRouter({
    mode: 'history',
    routes,
});
Vue.use(Toasted, {
    router
});

// global navigation guard:
// Checking if user is loggedIn or not
// and redirectiong base on what routes they can access
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.isUserLoggedIn) {
            next({
                name: 'login',
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (store.getters.isUserLoggedIn) {
            next({
                name: 'todo',
            })
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})


// axios Interceptors
// The interceptor here ensures that we check for the token in local storage every time an ajax request is made
// So backend laravel api can find auth user by access token
axios.interceptors.request.use(
    (config) => {

        // trigger 'loading=true' event here
        store.dispatch('setLoading', true);

        if (store.getters.isUserLoggedIn) {
            let token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },

    (error) => {
        // trigger 'loading=false' event here
        store.dispatch('setLoading', false);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(function (response) {

    // trigger 'loading=false' event here
    store.dispatch('setLoading', false);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {

    // trigger 'loading=false' event here
    store.dispatch('setLoading', false);

    if (store.getters.isUserLoggedIn && error.response.status == 401) {

        router.push('/logout').catch(error => {})

    }
    return Promise.reject(error);
});


// When the page loads, that element gains focus
// (note: autofocus doesn’t work on mobile Safari).
// In fact, if you haven’t clicked on anything else since visiting this page,
// the input above should be focused now. Now let’s build the directive that accomplishes this:
// Register a global custom directive called `v-focus`
Vue.directive('focus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el) {
        // Focus the element
        el.focus()
    }
})

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/Master.vue -> <master></master>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('master', require('./Master.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    store,

    // on app created (refresh)
    mounted() {
        // if user is logged in
        if (this.$store.getters.isUserLoggedIn) {
            // getting user information base on access_token in localstorage
            this.$store.dispatch('getUserInformation')
            // if errors -> user dosnt exists -> then logout the frontend user
        }

    },
});
