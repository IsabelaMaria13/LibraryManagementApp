<template>
  <MenuComponent />
  <div>
    <div class="content-container">
      <div v-if="loading">Loading...</div>
      <div v-if="errorMessage">
        <p style="color: red;">{{ errorMessage }}</p>
      </div>
      <div v-if="isSmallScreen">
        <div class="book-card" v-for="book in paginatedBooks" :key="book.id">
          <div class="book-detail"><img :src="book.thumbnail" alt="Book Thumbnail" /></div>
          <div class="book-detail"><span class="book-detail-label">ID:</span> {{ book.id }}</div>
          <div class="book-detail"><span class="book-detail-label">Title:</span> {{ book.title }}</div>
          <div class="book-detail"><span class="book-detail-label">Authors:</span> {{ book.authors }}</div>
          <div class="book-detail"><span class="book-detail-label">Publisher:</span> {{ book.publisher }}</div>
          <div class="book-detail"><span class="book-detail-label">Published Date:</span> {{ book.publishedDate }}</div>
          <div class="book-detail"><span class="book-detail-label">Page Count:</span> {{ book.pageCount }}</div>
          <div class="book-detail"><span class="book-detail-label">Categories:</span> {{ book.categories }}</div>
          <div class="book-detail"><span class="book-detail-label">Language:</span> {{ book.language }}</div>
          <div class="book-detail"><span class="book-detail-label">Copies:</span> {{ book.numberOfCopies }}</div>
          <div class="book-detail"><span class="book-detail-label">Available:</span> {{ book.numberOfAvailable }}</div>
          <div class="book-detail"><span class="book-detail-label">Date Added:</span> {{ book.dateAdded }}</div>
          <button @click="saveBook(book)">Save</button>
        </div>
      </div>
      <table v-else class="books-table">
        <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Google ID</th>
          <th>Title</th>
          <th>Authors</th>
          <th>Publisher</th>
          <th>Published Date</th>
          <th>Page Count</th>
          <th>Categories</th>
          <th>Language</th>
          <th>Copies</th>
          <th>Available</th>
          <th>Date Added</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="book in paginatedBooks" :key="book.id">
          <td><img :src="book.thumbnail" alt="Book Thumbnail" width="50" /></td>
          <td class="id-cell">{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.authors }}</td>
          <td>{{ book.publisher }}</td>
          <td>{{ book.publishedDate }}</td>
          <td>{{ book.pageCount }}</td>
          <td>{{ book.categories }}</td>
          <td>{{ book.language }}</td>
          <td contenteditable="true" @input="updateField(book, 'numberOfCopies', $event)">{{ book.numberOfCopies }}</td>
          <td contenteditable="true" @input="updateField(book, 'numberOfAvailable', $event)">{{ book.numberOfAvailable }}</td>
          <td contenteditable="true" @input="updateField(book, 'dateAdded', $event)">{{ book.dateAdded }}</td>
          <td><button @click="saveBook(book)">Save</button></td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {ref, onMounted, computed, onUnmounted} from "vue";
import MenuComponent from "@/components/Menu.vue";

const books = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const errorMessage = ref("");
const loading = ref(false);
const isSmallScreen = ref(window.innerWidth <= 600);

const fetchBooks = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/list/getBooks");
    books.value = response.data.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title || "No Title",
      authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author",
      publisher: book.volumeInfo.publisher || "Unknown Publisher",
      publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
      description: book.volumeInfo.description || "No Description",
      pageCount: book.volumeInfo.pageCount || "Unknown",
      categories: book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "No Categories",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      language: book.volumeInfo.language || "Unknown",
      saleability: book.saleInfo.saleability || "Not for Sale",
      viewability: book.accessInfo.viewability || "Unknown",
      numberOfCopies: book.numberOfCopies || 0,
      numberOfAvailable: book.numberOfAvailable || 0,
      dateAdded: new Date(book.dateAdded).toLocaleDateString() || "Unknown",
    }));
  } catch (error) {
    errorMessage.value = error.response?.data || error.request ? "No response from server" : error.message;
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => Math.ceil(books.value.length / itemsPerPage));

const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return books.value.slice(startIndex, startIndex + itemsPerPage);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const saveBook = async (book) => {
  try {
    await axios.put(`http://localhost:3000/list/updateBook/${book.id}`, book);
    alert("Book updated successfully!");
  } catch (error) {
    alert("Failed to update the book.");
  }
};

const updateField = (book, field, event) => {
  book[field] = event.target.innerText.trim();
};

const handleResize = () => {
  isSmallScreen.value = window.innerWidth <= 1000;
};

onMounted(() => {
  fetchBooks();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
@media (max-width: 1000px) {
  .books-table {
    display: none;
  }

  .book-card {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  .book-detail {
    margin: 5px 0;
  }

  .book-detail img {
    width: 100%;
    height: auto;
  }

  .book-detail-label {
    font-weight: bold;
  }
}

.content-container {
  margin-top: 40px;
  padding: 30px;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  table-layout: fixed;
  word-wrap: break-word;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 500px;
}

.books-table th,
.books-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.3s ease;
}

.books-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.books-table img {
  display: block;
  margin: 0 auto;
}

.id-cell {
  white-space: normal;
  word-wrap: break-word;
  max-width: none;
  overflow: visible;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 8px 16px;
}

.pagination span {
  font-size: 1rem;
}

</style>
