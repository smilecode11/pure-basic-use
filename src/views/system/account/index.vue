<template>
  <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <div class="dv-a">A</div>
      </template>
      <!-- #paneR 表示指定该组件为右侧面板 -->
      <template #paneR> <div class="dv-b">B</div> </template>
    </splitpane>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { reactive } from "vue";
export default defineComponent({
  name: "SystemAccount",
  components: { splitpane },
  setup() {
    const settingLR: ContextProps = reactive({
      minPercent: 15,
      defaultPercent: 20,
      split: "vertical"
    });

    return {
      settingLR
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
}
</style>
