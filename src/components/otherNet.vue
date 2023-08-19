<template>
       <t-loading size="medium" text="加载中..." :loading="loading" show-overlay class="h-full">
      <iframe :src="frameSrc" class="frame-iframe w-full h-full" ref="frameRef" />
    </t-loading>
  </template>
  
<script setup>
import { useRoute } from "vue-router";
import { ref, unref, onMounted, nextTick } from "vue";

defineOptions({
  name: "FrameView"
});

const loading = ref(true);
const currentRoute = useRoute();
const frameSrc = ref("");
const frameRef = ref(null);

if (unref(currentRoute.meta)?.frameSrc) {
  console.log(unref(currentRoute.meta))
  frameSrc.value = unref(currentRoute.meta)?.frameSrc;
}
unref(currentRoute.meta)?.frameLoading === false && hideLoading();

function hideLoading() {
  loading.value = false;
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe;
    if (_frame.attachEvent) {
      _frame.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  init();
});

</script>

<style lang="scss" scoped>
.frame {
  z-index: 998;
  height: calc(100vh - 88px);

  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}

.main-content {
  margin: 2px 0 0 !important;
}
</style>