<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" max-width="400" elevation="4">
      <v-card-title class="text-h5 text-center">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">

          <v-text-field
              label="Email"
              v-model="email"
              required
              outlined
          ></v-text-field>

          <v-text-field
              label="Password"
              v-model="password"
              type="password"
              required
              outlined
          ></v-text-field>

          <v-btn color="primary" block type="submit" class="my-4">
            Login
          </v-btn>
        </v-form>
        <v-alert type="info" class="mt-3">
          Don't have an account? <router-link to="/register">Register</router-link>.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>



<script>
import axios from "../plugins/axios";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/auth/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        this.$router.push("/profile");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

html,
body,
.v-application {
  height: 100%;
  margin: 0;
  padding: 0;
}

.fill-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>

