<script setup>
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  selectedLine: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(["line-select"])

function selectLine(lineNum) {
  emit("line-select", lineNum)
}

</script>

<template>
  <div class="code-view-container">
    <div class="tab-title">Source Code</div>
    <div class="source-view">
      <div class="code-line"
           v-for="(line, index) in (typeof(code) === 'string' ? code.split('\n') : [])"
           :key="index"
           @mouseup="() => selectLine(index)"
           :data-selected="index === selectedLine">
        <highlightjs
            language="c"
            :code="line.length > 0 ? line : ''"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .code-view-container {
    position: relative;
    flex: 2;
    flex-basis: 10px;
    min-height: max-content;
    overflow-x: scroll;
    overflow-y: visible;
    padding-left: 4px;
  }

  .source-view {
    position: relative;
    overflow: visible;
    font-family: monospace;
    padding-top: 32px;
    flex: 1;
    line-height: 18px;
    min-width: max-content;
    min-height: max-content;
    width: 100%;
  }

  .code-line {
    position: relative;
    height: 20px;
    white-space: pre;
    overflow: visible;
    tab-size: 2;
    min-width: max-content;
    padding: 0 4px 0 12px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    cursor: text;
    border: solid 1px transparent;

    span {
      display: inline-block;
      width: 100%;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border: solid 1px rgba(255, 255, 255, 0.3);
    }

    &:not(:hover) {
      transition: background-color 0.2s, border 0.2s;
    }

    &[data-selected="true"] {
      animation: pulse 1s infinite;
      color: #000;
      border: solid 1px orangered;
    }
  }
</style>