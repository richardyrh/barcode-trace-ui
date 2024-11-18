<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  freqs: {
    type: Array,
    required: true
  },
  selectedLine: {
    type: Number,
    required: true
  }
})

const maxWidth = computed(() => Math.max(...props.freqs.map(line => line.width)))

const offsetTop = ref(32);
</script>

<template>
  <div class="bar-graph-container">
    <div class="tab-title">Line Frequency</div>
    <div class="bar-stretcher"
         :style="{
           height: (((freqs.length > 0 ? freqs[freqs.length - 1].line : 0) * 20) + 20 + 8 + offsetTop) + 'px'
         }"
    />
    <div class="bar-container"
         v-for="(line, index) in freqs"
         :key="index"
         :style="{
           top: (line.line * 20 + offsetTop) + 'px'
         }"
         :data-selected="line.line === selectedLine">
      <span
          class="freq-text"
          v-text="line.width"
      ></span>
      <div class="bar"
           :style="{
             width: line.width + 'px',
             '--bar-color': `hsl(${(line.width / maxWidth * 40) + 180}deg, 80%, 60%)`
           }">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .bar-graph-container {
    display: flex;
    flex-direction: column;
    overflow-x: scroll;
    overflow-y: hidden;
    position: relative;
    min-height: 100%;
    align-self: stretch;
  }

  .bar-container {
    position: absolute;
    top: 0;
    height: 20px;

    display: flex;
    flex-direction: row;
    align-self: stretch;
    overflow-x: visible;
    padding-right: 8px;
    border-top: solid 1px transparent;
    border-right: solid 1px transparent;
    border-bottom: solid 1px transparent;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    transition: background-color 0.2s, border 0.2s;

    &[data-selected="true"] {
      animation: pulse 1s infinite;
      border-top: solid 1px orangered;
      border-bottom: solid 1px orangered;
      border-right: solid 1px orangered;

      & > .freq-text {
        color: #fff;
      }
    }
  }

  .freq-text {
    display: inline-block;
    width: 48px;
    height: 18px;
    line-height: 16px;
    text-align: right;
    padding-right: 8px;
    font-family: monospace;
    color: #888;
  }

  .bar {
    height: 13px;
    margin: 2px 4px;
    box-sizing: content-box;
    //background: linear-gradient(to right, #7bc 0%, #fff 100%);
    background: var(--bar-color);
    border-radius: 4px;
    transition: transform 1s;
    animation: bar-wipe 1s;
    transform-origin: left;
  }

  .bar-stretcher {
    position: relative;
    box-sizing: content-box;
  }

</style>