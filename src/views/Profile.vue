<template>
  <MenuComponent/>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-card-title>
        Profile
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ profile.firstName }} {{ profile.lastName }}</v-list-item-title>
            <v-list-item-subtitle>email: {{ profile.email }}</v-list-item-subtitle>
            <v-list-item-subtitle>phone: {{ profile.phone }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="fetchProfile">
          Refresh
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mx-auto mt-5" max-width="500">
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              label="Old Password"
              v-model="passwords.oldPassword"
              type="password"
              required
          ></v-text-field>
          <v-text-field
              label="New Password"
              v-model="passwords.newPassword"
              :error-messages="passwordError"
              type="password"
              required
          ></v-text-field>
          <v-btn :loading="loading" color="primary" @click="changePassword">
            Change Password
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';

import {jwtDecode} from "jwt-decode";
import axios from "@/plugins/axios.js";
import MenuComponent from "@/components/Menu.vue";

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});
const passwords = ref({
  oldPassword: '',
  newPassword: ''
});
const errorMessage = ref("");
const loading = ref(false);
const userId = ref(null);
const passwordError = ref('');

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    userId.value = decoded.id;
  }
}

async function fetchProfile() {
  getUserIdFromToken();
  try {
    const response = await axios.get(`/auth/profile/${userId.value}`);
    profile.value = response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    errorMessage.value = error.response?.data || 'Failed to fetch user.';
  }
}

onMounted(() => {
  fetchProfile();
});

async function changePassword() {
  loading.value = true;
  passwordError.value = '';
  try {
    await axios.post('/auth/changePassword', {
      librarianId: userId.value,
      oldPassword: passwords.value.oldPassword,
      newPassword: passwords.value.newPassword
    });
    passwords.value.oldPassword = '';
    passwords.value.newPassword = '';
    alert('Password changed successfully');
  } catch (error) {
    if (error.response && error.response.data) {
      passwordError.value = error.response.data.message;
    } else {
      alert('Failed to change password');
      console.error('Error changing password:', error);
    }
  } finally {
    loading.value = false;
  }
}

</script>
