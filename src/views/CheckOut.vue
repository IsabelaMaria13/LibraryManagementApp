<template>
  <div>
    <MenuComponent />
    <div>
      <form @submit.prevent="checkoutBook">
        <label for="user"> Select User:  </label>
        <select v-model="selectedUser" required>
          <option v-for="user in userOptions" :key="user.id" :value="user">
            {{ user.name }}
          </option>
        </select>

        <label for="bookId">Book ID:   </label>
        <input
            type="text"
            id="bookId"
            v-model="googleBookId"
            placeholder="Enter Book ID"
            required
        />

        <button type="submit" class="checkout-button">Check Out</button>
      </form>

      <div class="content-container">
        <div v-if="loading">Loading...</div>
        <div v-if="errorMessage">
          <p style="color: red;">{{ errorMessage }}</p>
        </div>
        <table class="users-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Date of birth</th>
            <th>Registered at</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.city }}</td>
            <td>{{ user.dateOfBirth }}</td>
            <td>{{ user.registeredAt }}</td>
          </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>
      </div>
    </div>
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
      currentPage: 1,
      itemsPerPage: 10,
      errorMessage: "",
      loading: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.userOptions.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.userOptions.slice(startIndex, startIndex + this.itemsPerPage);
    },
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        this.userOptions = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.address.city,
          registeredAt: user.registeredAt,
          dateOfBirth: user.dateOfBirth,
        }));
      } catch (error) {
        this.errorMessage = error.response?.data || 'Failed to fetch users.';
      } finally {
        this.loading = false;
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
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
.content-container {
  margin: 20px auto;
  padding: 20px;
  max-width: 1200px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}


.users-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.users-table th,
.users-table td {
  border: 1px solid #ddd;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.users-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: left;
}

.checkout-button {
  border: 1px solid #333333;
  padding: 5px 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.checkout-button:hover {
  background-color: #666666;
  color: #ffffff;
}

select {
  border: 1px solid #ccc;
  margin: 0 15px 0 5px;
  border-radius: 4px;
  color: #333;
}

select:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}


</style>
