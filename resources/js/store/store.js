
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
export default new Vuex.Store({

    // State
    // Vuex uses a single state tree - that is, this single object contains all your application level state and serves as the "single source of truth".
    // This also means usually you will have only one store for each application.
    // A single state tree makes it straightforward to locate a specific piece of state, and allows us to easily
    // take snapshots of the current app state for debugging purposes.
    state:{

        todos:[
            {
                'id':1,
                'title':'First todo',
                'completed': false,
                'editing': false
            },
            {
                'id':2,
                'title':'Take over the world',
                'completed': false,
                'editing': false
            },
            {
                'id':3,
                'title':'Code every day',
                'completed': true,
                'editing': false
            },
        ]

    },

    // Getters
    // Sometimes we may need to compute derived state based on store state,
    // for example filtering through a list of items and counting them:
    getters:{

        allTodos(state){
            return state.todos;
        }

    },

    // Mutations
    // The only way to actually change state in a Vuex store is by committing a mutation.
    // Vuex mutations are very similar to events: each mutation has a string type and a handler.
    // The handler function is where we perform actual state modifications,
    // and it will receive the state as the first argument:
    mutations:{

    },

    // Actions
    // Actions are similar to mutations, the differences being that:
    //  * Instead of mutating the state, actions commit mutations.
    //  * Actions can contain arbitrary asynchronous operations.
    actions: {

    }
})
