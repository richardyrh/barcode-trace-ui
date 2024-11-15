<script setup>
const props = defineProps({
  freqs: {
    type: Array,
    required: true
  }
})

</script>

<template>
  <div class="bar-graph-container">
    BAR GRAPH
    <div class="bar-container"
         v-for="(line, index) in freqs"
         :key="index">
      <div class="bar"
           :style="{
             marginTop: (line.line * 16) + 'px',
             width: line.width + 'px'
           }">
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bar {
    height: 16px;
    background: linear-gradient(to right, #00b4d8 0%, #f9f871 50vh);
    border-radius: 4px;
    transition: width 1s;
  }
  @keyframes bar-wipe {

  }
</style>