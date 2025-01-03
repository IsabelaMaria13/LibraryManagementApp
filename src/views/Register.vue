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
        ></v-text-field>

        <v-text-field
            v-model="lastName"
            :rules="[rules.required]"
            label="Last Name"
            outlined
            dense
            clearable
        ></v-text-field>

        <v-text-field
            v-model="email"
            :rules="[rules.required]"
            label="Email Address"
            outlined
            dense
            clearable
            type="email"
        ></v-text-field>

        <v-text-field
            v-model="phone"
            :rules="[rules.required]"
            label="Phone Number"
            outlined
            dense
            clearable
            type="tel"
        ></v-text-field>

        <v-text-field
            v-model="password"
            :rules="[rules.required]"
            label="Password"
            outlined
            dense
            clearable
            type="password"
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
        firstName: [],
        lastName: [],
        email: [],
        phone: [],
        password: [],
      },
      rules: {
        required: (value) => !!value || "This field is required.",
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
        this.$router.push("/");
      } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
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

