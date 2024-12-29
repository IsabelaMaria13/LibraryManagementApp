import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Profile from "@/views/Profile.vue";
import AddBooks from "@/views/AddBooks.vue";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: Login },
    { path: "/register", name: "Register", component: Register },
    { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/books", name: "Books", component: AddBooks },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
        next("/login");
    } else {
        next();
    }
});

export default router;
