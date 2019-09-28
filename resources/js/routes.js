import Frontpage from "./components/views/Frontpage";
import Todo from "./components/views/Todo"

const routes = [
    { path: '/', component: Frontpage, name: 'frontpage' },
    { path: '/todo', component: Todo, name: 'todo' },
];



export default routes;
