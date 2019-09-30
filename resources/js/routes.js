import Frontpage from "./components/views/Frontpage";
import Todo from "./components/views/Todo"
import Login from "./components/views/auth/Login"
import Register from "./components/views/auth/Register";

const routes = [
    { path: '/', component: Frontpage, name: 'frontpage' },
    { path: '/todo', component: Todo, name: 'todo' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
];



export default routes;
