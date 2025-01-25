<template>
  <div>
    <MenuComponent />
    <form @submit.prevent="filterLoans">
      <label for="googleBookId">Book ID:</label>
      <input
          id="googleBookId"
          v-model="googleBookId"
          placeholder="Enter Book ID"
          required
      />
      <button type="submit" class="filter-button">Filter</button>
    </form>

    <div class="content-container">
      <div v-if="loading">Loading...</div>
      <div v-if="errorMessage">
        <p style="color: red;">{{ errorMessage }}</p>
      </div>
      <table class="loans-table">
        <thead>
        <tr>
          <th>Select</th>
          <th>Book Name</th>
          <th>Book ID</th>
          <th>User Name</th>
          <th>Checkout Date</th>
          <th>Due Date</th>
          <th>Returned</th>
          <th>Return Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="loan in paginatedLoans" :key="loan.id">
          <td><input type="checkbox" v-model="selectedLoans" :value="loan"></td>
          <td>{{ loan.bookName }}</td>
          <td>{{ loan.bookId }}</td>
          <td>{{ loan.userName }}</td>
          <td>{{ loan.checkoutDate }}</td>
          <td>{{ loan.dueDate }}</td>
          <td>{{ loan.returned }}</td>
          <td>{{ loan.returnDate }}</td>
        </tr>
        </tbody>
      </table>

      <button @click="checkInSelected" class="checkin-button">Check-In</button>
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
</template>


<script setup>
import axios from 'axios';
import MenuComponent from "@/components/Menu.vue";
import { computed, onMounted, ref } from "vue";

const googleBookId = ref('');
const loading = ref(false);
const errorMessage = ref('');
const loans = ref([]);
const selectedLoans = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalPages = ref(1);

const fetchLoans = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get('http://localhost:3000/checkIn/loans');
    loans.value = response.data.map(loan => ({
      id: loan.id,
      bookName: loan.bookName,
      bookId: loan.bookId,
      userName: loan.userName,
      checkoutDate: loan.checkoutDate,
      dueDate: loan.dueDate,
      returned: loan.returned,
      returnDate: loan.returnDate
    }));
    totalPages.value = Math.ceil(loans.value.length / itemsPerPage.value);
  } catch (error) {
    errorMessage.value = "Failed to load loan data.";
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const filterLoans = () => {
  currentPage.value = 1;
};

const filteredLoans = computed(() => {
  if (googleBookId.value) {
    return loans.value.filter(loan => loan.bookId.includes(googleBookId.value));
  }
  return loans.value;
});

const paginatedLoans = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredLoans.value.slice(startIndex, endIndex);
});

const checkInSelected = async () => {
  if (selectedLoans.value.length === 0) {
    alert('Please select at least one loan to check in.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/checkIn/checkIn', {
      selectedLoans: selectedLoans.value.map(loan => ({
        googleBookId: loan.bookId,
        userName: loan.userName,
      })),
    });

    alert(response.data.message);
    await fetchLoans();
  } catch (error) {
    console.error('Error during book check-in:', error);
    alert(`Failed to check in books: ${error.response?.data?.message || error.message}`);
  }
};


const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

onMounted(() => {
  fetchLoans();
});
</script>

<style scoped>
@media (max-width: 1000px) {
  .filter-button {
    width: 100%;
    padding: 8px;
    font-size: 0.9rem;
  }

  .loans-table {
    font-size: 0.8rem;
    table-layout: auto;
  }

  .loans-table th,
  .loans-table td {
    display: none;
  }
  .loans-table th:nth-child(1),
  .loans-table td:nth-child(1),
  .loans-table th:nth-child(2),
  .loans-table td:nth-child(2),
  .loans-table th:nth-child(4),
  .loans-table td:nth-child(4) {
    display: table-cell;
  }

  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination button {
    width: 100%;
    margin-bottom: 5px;
    padding: 8px;
    font-size: 0.9rem;
  }

  .checkin-button {
    width: 100%;
    padding: 8px;
    font-size: 0.9rem;
  }

}

form {
  margin: 20px auto;
  padding: 20px;
  max-width: 1200px;
}
.content-container{
  margin: 20px auto;
  padding: 20px;
  max-width: 1200px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

label {
  margin-bottom: 5px;
}

.filter-button{
  margin-left:15px;
  border: 1px solid #333333;
  padding: 5px 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

input,
button {
  padding: 10px;
  margin-bottom: 10px;
}

.content-container {
  margin-top: 20px;
  padding: 20px;
}

.loans-table {
  width: 100%;
  table-layout: fixed;
}

.loans-table th,
.loans-table td {
  border: 1px solid #ddd;
  padding: 8px;
  overflow: hidden;
}

.loans-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: left;
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
  background: #666666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  color: #333;
}
.checkin-button{
  margin-top:15px;
  border: 1px solid #333333;
  padding: 5px 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.checkin-button:hover {
  background-color: #666666;
  color: #ffffff;
}
</style>
