import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Profile from "@/views/Profile.vue";
import AddBooks from "@/views/AddBooks.vue";
import List from "@/views/List.vue";
import axios from "axios";


const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "Login", component: Login },
    { path: "/register", name: "Register", component: Register },
    { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/books", name: "Books", component: AddBooks, meta: { requiresAuth: true } },
    { path: "/list", name: "List", component: List, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
        next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

export default router;
