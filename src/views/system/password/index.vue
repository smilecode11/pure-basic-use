<template>
  <div class="w-full bg-bg_color container">
    <el-tabs type="border-card" v-model="defaultTab">
      <el-tab-pane name="pass">
        <template #label>
          <span class="custom-tabs-label flex items-center">
            <IconifyIconOnline icon="ep:lock" />
            <span class="ml-1">密码设置</span>
          </span>
        </template>
        <Pass />
      </el-tab-pane>
      <el-tab-pane name="avatar">
        <template #label>
          <span class="custom-tabs-label flex items-center">
            <IconifyIconOnline icon="ep:avatar" />
            <span class="ml-1">头像设置</span>
          </span>
        </template>
        <Avatar />
      </el-tab-pane>
      <el-tab-pane name="setting">
        <template #label>
          <span class="custom-tabs-label flex items-center">
            <IconifyIconOnline icon="ep:setting" />
            <span class="ml-1">账号设置</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Pass from "./Pass.vue";
import Avatar from "./Avatar.vue";
export default defineComponent({
  name: "SystemPassword",
  components: { Pass, Avatar },
  setup() {
    const defaultTab = ref("pass");
    return {
      useRenderIcon,
      defaultTab
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 !important;
  max-width: 100%;
}
</style>
