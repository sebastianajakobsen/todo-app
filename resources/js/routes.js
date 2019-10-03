import Frontpage from "./components/views/Frontpage";
import Todo from "./components/views/TodoList"
import Login from "./components/views/auth/Login"
import Register from "./components/views/auth/Register";
import Logout from "./components/views/auth/Logout";

const routes = [
    {
        path: '/',
        component: Frontpage,
        name: 'frontpage'
    },
    {
        path: '/todo',
        component: Todo,
        name: 'todolist',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
        props: true,
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/register',
        component: Register,
        name: 'register',
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/logout',
        component: Logout,
        name: 'logout',
        meta: {
            requiresAuth: true
        }
    },
];


export default routes;
