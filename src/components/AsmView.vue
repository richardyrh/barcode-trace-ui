<script setup>

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  selectedLine: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="asm-view-container">
    <div class="tab-title">Assembly View</div>
    <div class="source-view">
      <div class="code-line"
           v-for="(line, index) in code.split('\n')"
           :key="index"
           :data-selected="index === selectedLine">
        <span>{{ line }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .asm-view-container {
    position: relative;
    flex: 1;
    flex-basis: 0;
    overflow-x: scroll;
    overflow-y: hidden;
    background: linear-gradient(to right, #1e1e1e 90%, #1a1a1a 100%);
  }

  .source-view {
    position: relative;
    overflow: visible;
    font-family: monospace;
    padding-top: 32px;
    padding-left: 16px;
    flex: 1;
    line-height: 20px;
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
    padding: 0 4px;
    cursor: text;

    span {
      display: inline-block;
      width: 100%;
    }

    &[data-selected="true"] {
      color: orangered;
    }
  }
</style>