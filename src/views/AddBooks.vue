<script>
import axios from "axios";
import MenuComponent from "@/components/Menu.vue";

export default {
  components: {MenuComponent},
  data() {
    return {
      bookData: {
        title: "",
        author: "",
        publisher: "",
        category: "",
        isbn: "",
      },
    };
  },
  methods: {
    async submitBook() {
      try {
        const response = await axios.post("http://localhost:3000/books/addBooks", {
          bookData: this.bookData,
        });
        console.log(response.data.message);
        this.$router.push("/books");
      } catch (error) {
        console.error("Error adding book:", error);
      }
    },
  },
};
</script>

<template>
  <div class="add-book">
    <div>
      <MenuComponent />
    </div>
    <v-main>
    <h1 class="title">Add Book</h1>
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
          <v-btn color="primary" type="submit" class="mt-4 v-btn" block>Submit</v-btn>
        </v-form>
      </v-card>
    </v-container>
      </v-main>
  </div>
</template>

<style scoped>
.add-book {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #3f51b5;
  text-align: center;
}

.v-btn {
  font-size: 1rem;
  font-weight: bold;
}

</style>
