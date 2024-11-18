<script setup>
import {computed, onMounted, ref, useTemplateRef} from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    required: true
  }
});
const timelineContainer = useTemplateRef("timelineContainer")
const caret = useTemplateRef("caret")

function genColor(seed) {
  const baseHue = 200;
  // Helper to generate pseudo-random numbers based on a seed
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const hueOffset = Math.floor(seededRandom(seed) * 16) - 8;
  const h = (baseHue + hueOffset + 360) % 360; // Ensure hue is within 0-359
  const s = Math.floor(seededRandom(seed + 1) * 71) + 20;
  const l = Math.floor(seededRandom(seed + 2) * 51) + 30;

  // return `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  return `linear-gradient(to top, hsl(${h}, ${s}%, ${l}%) 0%, hsl(${h}, ${s}%, ${l + 10}%) 100%)`;
}

const currentTime = ref(0);
const currentLine = ref(props.length > 0 ? props.timeline[0].line : 0);
const logBlockScale = ref(0);
const blockScale = computed(() => Math.pow(2, logBlockScale.value));
const timelineWidth = ref(1);
const minScale = computed(() => {
  const endTime = props.timeline[props.timeline.length - 1].startTime;
  return timelineWidth.value / endTime
});
const minLogScale = computed(() => Math.log2(minScale.value));
const caretScrollLeft = computed(() => currentTime.value * blockScale.value);
const caretScreenX = ref(0);
const timelineScrollLeft = ref(0); // needed to make start time reactive
const windowStartTime = computed(() => timelineScrollLeft.value / blockScale.value);
const windowDuration = computed(() =>
    timelineContainer.value === null ? 0 : timelineWidth.value / blockScale.value);
const emit = defineEmits(["line-select"])

function handleTimelineClick(event) {
  const parentElement = timelineContainer.value;
  const scrollLeft = parentElement.scrollLeft;
  const clickX = event.clientX - parentElement.getBoundingClientRect().left;
  const offsetX = clickX + scrollLeft;
  currentLine.value = event.target.dataset.line;
  currentTime.value = Math.round(offsetX / blockScale.value * 100) / 100;
  caretScreenX.value = clickX;
  emit("line-select", parseInt(currentLine.value))
}

function adjustScroll() {
  timelineContainer.value.scrollLeft = caretScrollLeft.value - caretScreenX.value;
  timelineScrollLeft.value = timelineContainer.value.scrollLeft
}

function onScroll() {
  caretScreenX.value = (currentTime.value * blockScale.value)
      - timelineContainer.value.scrollLeft - 0.5;
  timelineScrollLeft.value = timelineContainer.value.scrollLeft
}

function onResize() {
  timelineWidth.value = timelineContainer.value.clientWidth;
}

const scrubberMoving = ref(false)
const scrubberStartPos = ref(0)
function handleScrubberMouseDown(event) {
  scrubberMoving.value = true;
  scrubberStartPos.value = event.clientX;
}
function handleScrubberMouseUp() { scrubberMoving.value = false; }
function handleScrubberMouseMove(event) {
  if (!scrubberMoving.value) return;
  timelineContainer.value.scrollLeft -= (scrubberStartPos.value - event.clientX) * (blockScale.value / minScale.value);
  scrubberStartPos.value = event.clientX;
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
})
</script>

<template>
  <div class="timeline-top-container">
    <div class="timeline-controls-container">
      <span>Cycle</span>
      <input type="text" v-model="currentTime" />
      <span>Line</span>
      <input type="text" readonly class="timeline-line-number" :value="currentLine" />
      <span>PC</span>
      <input type="text" readonly class="timeline-line-number" :value="0" />
      <div class="filler" />
      <span>Zoom</span>
      <input
          class="zoom-slider"
          type="range" :min="minLogScale" max="4" step="0.02"
          @input="adjustScroll"
          v-model="logBlockScale" />
    </div>
    <div
        class="timeline-container timeline-scroll-container"
        ref="timelineContainer"
        @scroll="onScroll"
        @click="handleTimelineClick">
      <div
          class="timeline-block"
          v-for="(block, index) in timeline.slice(0, -1)"
          :key="index"
          :style="{
            left: block.startTime * blockScale + 'px',
            width: (timeline[index + 1].startTime - block.startTime) * blockScale + 'px',
            background: genColor(block.line)
          }"
          :data-line="block.line"
          :data-selected="(currentTime >= block.startTime) && (currentTime < timeline[index + 1].startTime)">
        <span>{{ block.line }}</span>
      </div>
      <div
          class="timeline-caret"
          ref="caret"
          :style="{
            left: currentTime * blockScale + 'px'
          }"
      />
    </div>
    <div
        class="timeline-container timeline-scrubber-container"
        @mousedown="handleScrubberMouseDown"
        @mousemove="handleScrubberMouseMove"
        @mouseup="handleScrubberMouseUp">
      <div
          class="timeline-block"
          v-for="(block, index) in timeline.slice(0, -1)"
          :key="index"
          :style="{
            left: block.startTime * minScale + 'px',
            width: (timeline[index + 1].startTime - block.startTime) * minScale + 'px',
            background: genColor(block.line)
          }">
      </div>
      <div class="timeline-window"
           :style="{
             left: windowStartTime * minScale + 'px',
             width: windowDuration * minScale + 'px'
           }"
      />
      <div
          class="timeline-caret"
          ref="caret"
          :style="{
            left: currentTime * minScale + 'px'
          }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.timeline-top-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.timeline-container {
  position: relative;
  width: calc(100% - 40px);
  display: flex;
  flex-direction: row;
  height: 100%;
  background: linear-gradient(to bottom, #000 0%, #121212 100%);

  &.timeline-scroll-container {
    overflow-x: scroll;
    border-radius: 16px;
    scrollbar-width: none;
    margin: 16px 16px 8px 16px;
    flex: 3;
    cursor: crosshair;
  }

  &.timeline-scrubber-container {
    flex: 1;
    overflow-x: hidden;
    border-radius: 4px;
    scrollbar-width: none;
    margin: 8px 16px 24px 16px;

    .timeline-block {
      filter: brightness(0.8) saturate(0.5);
    }
  }
}

.timeline-block {
  position: absolute;
  height: 100%;
  transform-origin: left;
  animation: bar-wipe 1s;
  padding: 2px;

  &:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  &:nth-last-child(2) {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  &:not(:hover) {
    transition: border 0.2s, filter 0.2s;
  }

  .timeline-scroll-container > &:hover:not([data-selected="true"]) {
    padding: 1px;
    border: solid 1px rgba(255, 255, 255, 0.3);
    filter: brightness(1.1) saturate(1.2);
  }

  &[data-selected="true"] {
    padding: 0;
    border: solid 2px orangered;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: color.adjust(orangered, $alpha: -0.8);
    }
  }

  & > span {
    position: relative;
    display: block;
    top: calc(80% - 16px);
    color: rgba(0, 0, 0, 30%);
    text-overflow: fade;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    pointer-events: none;
  }
}

.filler {
  flex: 1;
}

.timeline-controls-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 0;
  padding: 8px 32px 8px 8px;
  background: var(--toolbar-gradient);
  column-gap: 16px;
  border-bottom: solid 1px #444;

  & > span {
    margin-left: 16px;
  }

  input[type="text"] {
    font-family: monospace;
    width: 80px;
    text-align: right;
    padding: 0 8px;
    background-color: #000;
    border: none;
    color: white;

    &[readonly] {
      outline: none;
      background: #111;
    }
  }

  input[type="range"] {
    appearance: none;
    -webkit-appearance: none;
    background-color: transparent;

    margin-top: 4px;
    border-radius: 16px;
    height: 16px;
    width: 200px;
    cursor: move;
    outline: none;
    /*  slider progress trick  */
    overflow: hidden;
  }

  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-moz-range-track {
    height: 16px;
    background: #111;
    border-radius: 16px;
  }

  input[type="range"]::-webkit-slider-thumb,
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    width: 16px;
    background-color: #aaa;
    border-radius: 50%;
    border: 1px solid #eee;
    box-sizing: border-box;
    /*  slider progress trick  */
    box-shadow: -407px 0 0 400px rgba(255, 255, 255, 0.2);
    transition: background-color 0.2s;
  }

  input[type="range"]:hover::-webkit-slider-thumb,
  input[type="range"]:hover::-moz-range-thumb {
    background-color: #fff;
  }
}

.zoom-slider{
  width: 400px;
}

.timeline-caret {
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: red;
  animation: flash 1s infinite;
}

.timeline-window {
  position: absolute;
  height: 100%;
  border: solid 1px orangered;
  backdrop-filter: brightness(1.25) saturate(2);
  transition: backdrop-filter 0.1s, box-shadow 0.1s;
  border-radius: 2px;
  cursor: grab;

  &:active {
    cursor: grabbing;
    backdrop-filter: brightness(1.5) saturate(2) blur(4px);
    box-shadow: rgba(0, 0, 0, 0.25) 0 0 8px;
  }
}
</style>