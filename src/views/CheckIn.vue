<template>
  <div>
    <MenuComponent />
    <h1>Check In Book</h1>
    <form @submit.prevent="checkInBook">
      <label for="googleBookId">Enter Google Book ID:</label>
      <input
          id="googleBookId"
          v-model="googleBookId"
          placeholder="Google Book ID"
          required
      />

      <button type="submit">Check In</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import MenuComponent from "@/components/Menu.vue";

export default {
  components: {MenuComponent},
  data() {
    return {
      googleBookId: ''
    };
  },
  methods: {
    async checkInBook() {
      if (!this.googleBookId) {
        alert('Please enter a Google Book ID.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/checkIn/checkIn', {
          googleBookId: this.googleBookId
        });
        alert('Book successfully checked in.');
        this.googleBookId = '';
      } catch (error) {
        console.error('Error during book check-in:', error.response.data.message);
        alert(`Failed to check in the book: ${error.response.data.message}`);
      }
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}

label {
  margin-bottom: 5px;
}

input,
button {
  padding: 10px;
  margin-bottom: 10px;
}

button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
}

button:hover {
  background-color: #0056b3;
}
</style>
