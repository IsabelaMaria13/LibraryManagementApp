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
              type="email"
              :error-messages="emailError"
          ></v-text-field>

          <v-text-field
              label="Password"
              v-model="password"
              type="password"
              required
              outlined
              :error-messages="passwordError"
          ></v-text-field>

          <v-btn :loading="isLoading" color="primary" block type="submit" class="my-4">
            Login
          </v-btn>
        </v-form>
        <v-alert type="info" class="mt-3">
          Don't have an account?
          <router-link to="/register">Register</router-link>
          .
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../plugins/axios';
import { useRouter, useRoute } from 'vue-router';

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();

const login = async () => {
  isLoading.value = true;
  emailError.value = '';
  passwordError.value = '';

  try {
    const response = await axios.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", response.data.token);

    await router.push(route.query.redirect ? route.query.redirect : '/books');
  } catch (error) {
    isLoading.value = false;
    if (error.response) {
      const { message } = error.response.data;
      if (message === 'User not found.') {
        emailError.value = message;
      } else if (message === 'Invalid credentials.') {
        passwordError.value = message;
      }
    } else {
      console.error('Login error:', error.message);
    }
  }
};
</script>

<style scoped>
.fill-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>

