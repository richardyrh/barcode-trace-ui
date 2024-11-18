import './assets/main.css'
import './assets/highlight.css'
import "splitpanes/dist/splitpanes.css"
import hljs from "highlight.js/lib/core";
import c from 'highlight.js/lib/languages/c';
import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('c', c);

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(hljsVuePlugin)
app.mount('#app')
