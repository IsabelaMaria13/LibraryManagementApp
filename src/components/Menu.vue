<template>
  <v-app-bar app>
    <v-toolbar-title>Library Management App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" @click="view" dark v-bind="attrs" v-on="on">Books</v-btn>
        <v-btn color="primary" @click="checkIn" dark v-bind="attrs" v-on="on">Check-In</v-btn>
        <v-btn color="primary" @click="checkOut" dark v-bind="attrs" v-on="on">Check-Out</v-btn>
        <v-btn color="primary" @click="profile" dark v-bind="attrs" v-on="on">Profile</v-btn>
        <v-btn color="primary" @click="logout" dark v-bind="attrs" v-on="on">Logout</v-btn>
      </template>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "MenuComponent",
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    logout() {
      console.log("User logged out");
      this.$router.push("/login");
    },
    view() {
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
  },
};
</script>

<style scoped>

</style>
