<script setup>
import CodeView from "@/components/CodeView.vue";
import BarGraph from "@/components/BarGraph.vue";
import Timeline from "@/components/Timeline.vue";
import FilePicker from "@/components/FilePicker.vue";
import AsmView from "@/components/AsmView.vue";

import {computed, ref, useTemplateRef, onMounted, watch} from "vue";
import {Splitpanes, Pane} from 'splitpanes';

const cSourceContent = ref("");
const asmSourceContent = ref([]);
const asmSourceContainer = useTemplateRef("asmSourceContainer");
const asmSourceHeight = ref(0);
const asmContextBefore = computed(() =>
  Math.floor((asmSourceHeight.value - 36) / 20 / 2)
);
const asmWindowSize = ref(64);
const asmWindowContent = computed(() => {
  if (selectedAsmLine > -1) return "";
  return asmSourceContent.value.slice(
      Math.max(0, selectedAsmLine.value - asmContextBefore.value),
      Math.max(0, selectedAsmLine.value - asmContextBefore.value + asmWindowSize.value))
      .join("\n");
});
const selectedLine = ref(0);
const selectedAsmLine = computed(() => {
  if (cLineToAsm.value.length > selectedLine.value) {
    return cLineToAsm.value[selectedLine.value];
  } else {
    return -1;
  }
});
const scrollBody = useTemplateRef("scrollBody")

const sourceFrequency = ref(((count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const zero = (Math.random() > 0.7);
    data.push({
      line: i,
      width: zero ? 0 : Math.floor(Math.random() * 400)
    });
  }
  return data;
})(200));
const timeline = ref(((count) => {
  if (count <= 0) return [];
  const data = [];
  let startTime = 0;
  for (let i = 0; i < count; i++) {
    const line = i === count - 1 ? -1 : Math.floor(Math.random() * 101);
    const timeIncrement = i === 0 ? 0 : Math.floor(Math.random() * 100) + 1;
    startTime += timeIncrement;
    data.push({ line, startTime });
  }
  return data;
})(200))
const cLineToAsm = ref([...Array(400).keys()])

function updateCSourceContent(content) { cSourceContent.value = String(content) }
function updateAsmSourceContent(content) { asmSourceContent.value = String(content).split("\n") }
function updateSelectedLine(line, scroll) {
  selectedLine.value = line
  if (scroll) {
    document.querySelector("#middle-scroll-container").scrollTop =
      Math.max(0, 20 * line - asmContextBefore.value * 20);
  }
}

onMounted(() => {
  asmSourceHeight.value = asmSourceContainer.value.clientHeight;
  window.addEventListener("resize", onResize);
});

function onResize() {
  asmSourceHeight.value = asmSourceContainer.value.clientHeight;
}

watch(asmSourceContent, onResize);
</script>

<template>
  <div id="top">
    <div id="top-container">
      <div id="logo">
        BARCODE TRACE UI
      </div>
      <div class="spacer"></div>
      <FilePicker
          id="file-picker-component"
          @update-source-content="updateCSourceContent"
          @update-asm-content="updateAsmSourceContent"
      />
    </div>
    <splitpanes horizontal id="top-split-pane">
      <pane>
        <splitpanes id="middle-container">
          <pane size="30">
            <div class="asm-view-container"
                 ref="asmSourceContainer">
              <AsmView
                  id="asm-view-component"
                  :selected-line="Math.min(asmContextBefore, selectedAsmLine)"
                  :code="asmWindowContent"
              />
            </div>
          </pane>
          <pane id="middle-scroll-container" ref="scrollBody">
            <div>
              <splitpanes id="middle-scroll-body">
                <pane class="scroll-pane">
                  <CodeView
                      id="code-view-component"
                      :code="cSourceContent"
                      :selected-line="selectedLine"
                      @line-select="line => updateSelectedLine(line, false)"
                  />
                </pane>
                <pane class="scroll-pane">
                  <BarGraph
                      id="bar-graph-component"
                      :freqs="sourceFrequency"
                      :selected-line="selectedLine"
                  />
                </pane>
              </splitpanes>
            </div>
          </pane>
        </splitpanes>
      </pane>
      <pane id="bottom-container" size="30">
        <Timeline
            id="timeline-component"
            :timeline="timeline"
            @line-select="line => updateSelectedLine(line, true)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss">
@use "./assets/splitter.scss";

#app {
  padding: 0;
}

#top {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
}

.tab-title {
  position: fixed;
  background: linear-gradient(to bottom,
      rgba(20, 20, 20, 0.9) 0%,
      rgba(20, 20, 20, 0.8) 50%,
      rgba(20, 20, 20, 0.0) 90%
  );
  z-index: 3;
  width: 100%;
  font-size: 12px;
  height: 32px;
  line-height: 24px;
  padding: 0 8px;
}

#top-container {
  display: flex;
  background: var(--toolbar-gradient);
  border-bottom: solid 1px #444;
  flex-direction: row;
  height: 64px;
  padding: 8px 16px;
  flex: 0;
  align-items: center;
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

#logo {
  font-weight: 200;
  margin-right: 32px;
  font-size: 18px;
  letter-spacing: 8px;
  color: white;
}

.spacer {
  flex: 2;
}

#top-split-pane {
  flex: 1;
  overflow: hidden;
}

#middle-container {
  //background-color: #1d222f;
  background-color: #202020;
  position: relative;
  display: flex;
  flex-direction: row;
}

#middle-scroll-container {
  position: relative;
  flex: 2;
  overflow-y: scroll;
  scroll-behavior: smooth;
  height: 100%;
}

#middle-scroll-body {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: stretch;
  min-height: 100%;
  height: unset;
}

.scroll-pane.splitpanes__pane {
  overflow-x: scroll;
  overflow-y: visible;
}

.asm-view-container {
  height: 100%;
}
#code-view-component, #asm-view-component {
  min-height: 100%;
}

#bottom-container {
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 32px;
  z-index: 2;
  min-height: 160px;
}

#bar-graph-component {
  position: relative;
}
</style>
