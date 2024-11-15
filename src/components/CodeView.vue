<script setup>
import { ref } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const selectedLine = ref(0)
const emit = defineEmits(["line-select"])

function selectLine(lineNum) {
  selectedLine.value = lineNum
  emit("line-select", lineNum)
}

</script>

<template>
  <div class="code-view-container">
    <div id="source-view">
      <div class="code-line"
           v-for="(line, index) in (typeof(code) === 'string' ? code.split('\n') : [])"
           :key="index"
           :data-selected="index === selectedLine">
        <span @mouseup="() => selectLine(index)">{{ line }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .code-view-container {
    position: relative;
    flex: 2;
    flex-basis: 10px;
    height: 100%;
    overflow: scroll;
  }

  #source-view {
    position: relative;
    overflow: visible;
    font-family: monospace;
    height: 100%;
    flex: 1;
    line-height: 16px;
    min-width: max-content;
    width: 100%;
  }

  .code-line {
    position: relative;
    height: 16px;
    white-space: pre;
    overflow: visible;
    tab-size: 2;
    min-width: max-content;

    span {
      display: inline-block;
      width: 100%;
    }

    &[data-selected="true"] {
      background-color: #e6f7ff;
      color: #000;
    }
  }
</style>