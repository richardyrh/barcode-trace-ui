<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Make sure to install axios: `npm install axios`

const files = ref([]);
const selectedFile = ref("");
const fileContent = ref("");

// Function to fetch files from backend
const fetchFiles = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/files'); // Replace with your API URL
    files.value = response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};

const emit = defineEmits(["update-source-content"])

// Load the selected file content
const loadFileContent = async () => {
  if (!selectedFile.value) return;
  console.log("new file loading")

  try {
    const response = await axios.get(`http://localhost:3000/api/load`, {
      params: { file: files.value[selectedFile.value - 1].name },
      transformResponse: []
    });
    fileContent.value = response.data;
  } catch (error) {
    console.error('Error loading file content:', error);
    fileContent.value = 'Error loading file content.';
  }
  emit("update-source-content", fileContent.value)
};

// Called when component is mounted
onMounted(() => {
  fetchFiles();
});
</script>

<template>
  <div class="file-picker-container">
    Read File: &nbsp;
    <div>
      <select v-model="selectedFile" @change="loadFileContent">
        <option value="" disabled>Select a file</option>
        <option v-for="file in files" :key="file.id" :value="file.id">
          {{ file.name }}
        </option>
      </select>
<!--      <p v-if="selectedFile">Selected File ID: {{ selectedFile }}</p>-->
    </div>
  </div>

</template>

<style scoped>
  .file-picker-container {
    position: relative;
    flex: 2;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }
</style>