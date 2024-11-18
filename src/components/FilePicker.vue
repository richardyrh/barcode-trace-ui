<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Make sure to install axios: `npm install axios`

const files = ref([]);
const selectedFile = ref("");

// Function to fetch files from backend
const fetchFiles = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/files'); // Replace with your API URL
    files.value = response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};

const emit = defineEmits(["update-source-content", "update-asm-content"])

// Load the selected file content
const loadFileContent = async () => {
  if (!selectedFile.value) return;

  let fileContent = "";
  let asmFileContent = "";
  try {
    const response = await axios.get(`http://localhost:3000/api/load`, {
      params: { file: files.value[selectedFile.value - 1].name },
    });
    fileContent = response.data["c"];
    asmFileContent = response.data["asm"];
  } catch (error) {
    fileContent = "Error loading file: " + error;
  }
  emit("update-source-content", fileContent);
  emit("update-asm-content", asmFileContent);
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
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
  }
</style>