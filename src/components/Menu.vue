<template>
  <v-app-bar app>
    <v-toolbar-title class="d-none d-md-flex">Library Management App</v-toolbar-title>
    <v-btn
        class="d-flex d-md-none"
        @click="toggleDrawer"
    >
      <i class="pi pi-bars" style="font-size: 24px;"></i>
    </v-btn>

    <v-spacer class="d-none d-md-flex"></v-spacer>
    <template v-if="!isSmallScreen">
      <v-btn
          v-for="item in menuItems"
          :key="item.route"
          color="primary"
          dark
          @click="navigate(item.route)"
      >
        {{ item.label }}
      </v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      app
      class="d-md-none"
  >
    <v-list>
      <v-list-item
          v-for="item in menuItems"
          :key="item.route"
          @click="navigate(item.route)"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const menuItems = [
  { label: "See Books", route: "/list" },
  { label: "Add Books", route: "/books" },
  { label: "Check-In", route: "/checkIn" },
  { label: "Check-Out", route: "/checkOut" },
  { label: "Profile", route: "/profile" },
  { label: "Logout", route: "/login" },
];

const router = useRouter();
const drawer = ref(false);
const isSmallScreen = ref(window.innerWidth <= 1000);

const navigate = (route) => {
  if (route === "/login") {
    localStorage.removeItem("token");
    console.log("User logged out");
  }
  drawer.value = false;
  router.push(route);
};

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 1000;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<style scoped>
.d-none {
  display: none !important;
}

.d-md-none {
  @media (min-width: 1000px) {
    display: none !important;
  }
}

.d-md-flex {
  display: none;
  @media (min-width: 1000px) {
    display: flex !important;
  }
}
</style>
