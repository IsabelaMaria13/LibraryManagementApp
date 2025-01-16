<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import MenuComponent from "@/components/Menu.vue";

const books = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const errorMessage = ref("");
const loading = ref(false);

const fetchBooks = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/list/getBooks");
    books.value = response.data.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title || "No Title",
      authors: book.volumeInfo.authors
          ? book.volumeInfo.authors.join(", ")
          : "Unknown Author",
      publisher: book.volumeInfo.publisher || "Unknown Publisher",
      publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
      description: book.volumeInfo.description || "No Description",
      pageCount: book.volumeInfo.pageCount || "Unknown",
      categories: book.volumeInfo.categories
          ? book.volumeInfo.categories.join(", ")
          : "No Categories",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      language: book.volumeInfo.language || "Unknown",
      saleability: book.saleInfo.saleability || "Not for Sale",
      viewability: book.accessInfo.viewability || "Unknown",
      numberOfCopies: book.numberOfCopies || 0,
      numberOfAvailable: book.numberOfAvailable || 0,
      dateAdded: new Date(book.dateAdded).toLocaleDateString() || "Unknown",
    }));
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data;
    } else if (error.request) {
      errorMessage.value = "No response from server";
    } else {
      errorMessage.value = error.message;
    }
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
    console.log(book);
    alert("Book updated successfully!");
  } catch (error) {
    console.error("Error updating book:", error.message);
    alert("Failed to update the book.");
  }
};

const updateField = (book, field, event) => {
  book[field] = event.target.innerText.trim();
};

onMounted(fetchBooks);
</script>

<template>
  <div>
    <MenuComponent/>
    <div class="content-container">
      <h1>Books List</h1>
      <div v-if="loading">Loading...</div>
      <div v-if="errorMessage">
        <p style="color: red;">{{ errorMessage }}</p>
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
          <td>
            <img :src="book.thumbnail" alt="Book Thumbnail" width="50"/>
          </td>
          <td>{{ book.id}}</td>
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
          <td>
            <button @click="saveBook(book)">Save</button>
          </td>
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
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.menu-container {
  margin-bottom: 30px;
}

.content-container {
  padding: 30px;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.books-table th,
.books-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.books-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: left;
}

.books-table img {
  display: block;
  margin: 0 auto;
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
