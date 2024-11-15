<script setup>
import CodeView from "@/components/CodeView.vue";
import BarGraph from "@/components/BarGraph.vue";
import Timeline from "@/components/Timeline.vue";
import FilePicker from "@/components/FilePicker.vue";

import { ref } from "vue";

const sourceContent = ref("");
const sourceFrequency = ref([
  { line: 0, width: 300 },
  { line: 2, width: 50 },
  { line: 5, width: 80 }
]);

function updateSourceContent(content) {
  sourceContent.value = String(content)
}
</script>

<template>
  <div id="top">
    <div id="top-container">
      <div id="logo">
        BARCODE TRACE UI
      </div>
      <FilePicker
          id="file-picker-component"
          @update-source-content="updateSourceContent"
      />
    </div>
    <div id="middle-container">
      <CodeView
          id="code-view-component"
          :code="sourceContent"
      />
      <BarGraph
          id="bar-graph-component"
          :freqs="sourceFrequency"
      />
    </div>
    <div id="bottom-container">
      <Timeline id="timeline-component" />
    </div>
  </div>
</template>

<style scoped lang="scss">
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

#top-container {
  display: flex;
  flex-direction: row;
  border-bottom: solid 4px #fff;
  height: 64px;
  padding: 8px 16px;
  flex: 0;
}

#logo {
  font-weight: 800;
  margin-right: 32px;
}

#middle-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

#bottom-container {
  border-top: solid 4px #fff;
  height: 320px;
  box-sizing: border-box;
}

#bar-graph-component {
  position: relative;
  height: 100%;
  flex: 2;
}
</style>
