<template>
  <div class="add-book">
    <div>
      <MenuComponent />
    </div>
    <v-main>
      <v-container class="form-container px-4 py-6 mx-auto fill-height d-flex align-center justify-center">
        <v-card class="pa-4 elevation-3">
          <v-form @submit.prevent="submitBook">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="bookData.title"
                    label="Title"
                    required
                    outlined
                    dense
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="bookData.author"
                    label="Author"
                    required
                    outlined
                    dense
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="bookData.publisher"
                    label="Publisher"
                    outlined
                    dense
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="bookData.category"
                    label="Category"
                    outlined
                    dense
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="bookData.isbn"
                    label="ISBN"
                    outlined
                    dense
                    clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn :disabled="loading" color="primary" type="submit" class="mt-4 v-btn" block>
              <span v-if="loading">Loading...</span>
              <span v-else>Submit</span>
            </v-btn>
          </v-form>
          <v-alert v-if="successMessage" type="success" class="mt-4">
            {{ successMessage }}
          </v-alert>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import axios from "axios";
import MenuComponent from "@/components/Menu.vue";
import { ref } from "vue";

const bookData = ref({
  title: "",
  author: "",
  publisher: "",
  category: "",
  isbn: "",
});
const loading = ref(false);
const successMessage = ref("");

const submitBook = async () => {
  loading.value = true;
  successMessage.value = "";
  try {
    const response = await axios.post("http://localhost:3000/books/addBooks", {
      bookData: bookData.value,
    });
    console.log(response.data.message);
    successMessage.value =`The books added successfully.`;
    bookData.value = {
      title: "",
      author: "",
      publisher: "",
      category: "",
      isbn: "",
    };
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error adding book:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-btn {
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.3s ease;
}
</style>

