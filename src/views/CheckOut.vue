<template>
  <div>
    <MenuComponent />
    <form @submit.prevent="checkoutBook">
      <label for="user">Select User:</label>
      <select v-model="selectedUser" required>
        <option v-for="user in userOptions" :key="user.id" :value="user">
          {{ user.name }}
        </option>
      </select>

      <label for="bookId">Google Book ID:</label>
      <input
          type="text"
          id="bookId"
          v-model="googleBookId"
          placeholder="Enter Google Book ID"
          required
      />

      <button type="submit">Check Out</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import MenuComponent from "@/components/Menu.vue";

export default {
  components: { MenuComponent },
  data() {
    return {
      userOptions: [],
      selectedUser: null,
      googleBookId: '',
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        this.userOptions = response.data.map(user => ({
          id: user.id,
          name: user.name,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async checkoutBook() {
      if (!this.selectedUser || !this.googleBookId) {
        alert('Please select a user and enter a Google Book ID.');
        return;
      }

      const payload = {
        userName: this.selectedUser.name,
        googleBookId: this.googleBookId,
      };

      try {
        await axios.post('http://localhost:3000/checkout/checkout', payload);
        alert('Book successfully checked out.');
        this.selectedUser = null;
        this.googleBookId = '';
      } catch (error) {
        console.error('Error during book checkout:', error.response.data.message);
        alert(`Failed to check out the book: ${error.response.data.message}`);
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
}

label {
  margin-top: 10px;
}

input,
button {
  margin-top: 5px;
  padding: 8px;
  font-size: 16px;
}

button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
