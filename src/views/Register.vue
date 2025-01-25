<template>
  <div class="registration-page">
    <h1 class="title">Login</h1>
    <p class="subtitle">Join our application to manage your library!</p>

    <v-container class="form-container px-4 py-6 mx-auto">
      <v-form ref="registerForm">

        <v-text-field
            v-model="firstName"
            :rules="[rules.required]"
            label="First Name"
            outlined
            dense
            clearable
            required
        ></v-text-field>

        <v-text-field
            v-model="lastName"
            :rules="[rules.required]"
            label="Last Name"
            outlined
            dense
            clearable
            required
        ></v-text-field>

        <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email Address"
            outlined
            dense
            clearable
            type="email"
            required
            :error-messages="errors.email"
        ></v-text-field>

        <v-text-field
            v-model="phone"
            :rules="[rules.required, rules.phone]"
            label="Phone Number"
            outlined
            dense
            clearable
            type="tel"
            required
            :error-messages="errors.phone"
        ></v-text-field>

        <v-text-field
            v-model="password"
            :rules="[rules.required, rules.password]"
            label="Password"
            outlined
            dense
            clearable
            type="password"
            required
            :error-messages="errors.password"
        ></v-text-field>

        <v-btn color="primary" block @click="register">
          Register
        </v-btn>
      </v-form>

      <v-alert type="info" class="mt-3">
        Already have an account? <router-link to="/login">Log in here</router-link>.
      </v-alert>
    </v-container>
  </div>
</template>


<script>
import axios from "../plugins/axios";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      },
      rules: {
        required: (value) => !!value || "This field is required.",
        email: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address.",
        phone: (value) =>
            /^\d{10}$/.test(value) || "Phone number must be 10 digits.",
        password: (value) =>
            value.length >= 8 ||
            "Password must be at least 8 characters long.",
      },
    };
  },
  methods: {
    async register() {
      const isValid = this.$refs.registerForm.validate();
      if (!isValid) {
        console.error("Form validation failed.");
        return;
      }

      try {
        await axios.post("/auth/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          password: this.password,
        });
        this.$router.push("/books");
      } catch (error) {
        const err = error.response?.data?.errors || {};
        this.errors.email = err.email || "";
        this.errors.phone = err.phone || "";
        this.errors.password = err.password || "";
      }
    },
  },
};
</script>

<style scoped>
.registration-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  min-height: 100vh;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.form-container {
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

v-btn {
  font-size: 1rem;
}

v-alert {
  text-align: center;
}
</style>

