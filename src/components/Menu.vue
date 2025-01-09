<template>
  <v-app-bar app>
    <v-toolbar-title>Library Management App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="seeBooks" dark>See Books</v-btn>
    <v-btn color="primary" @click="addBooks" dark>Add Books</v-btn>
    <v-btn color="primary" @click="checkIn" dark>Check-In</v-btn>
    <v-btn color="primary" @click="checkOut" dark>Check-Out</v-btn>
    <v-btn color="primary" @click="profile" dark>Profile</v-btn>
    <v-btn color="primary" @click="logout" dark>Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "MenuComponent",
  methods: {
    logout() {
      localStorage.removeItem("token");
      console.log("User logged out");
      this.$router.push("/login");
    },
    seeBooks() {
      this.$router.push("/list");
    },
    profile() {
      this.$router.push("/profile");
    },
    checkIn() {
      this.$router.push("/checkIn");
    },
    checkOut() {
      this.$router.push("/checkOut");
    },
    addBooks() {
      this.$router.push("/books");
    },
  },
};
</script>

<style scoped>

</style>
