<template>
  <div class="container">
    <div class="page-title">角色设置</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SystemRole",
  setup() {
    return {
      list: new Array(1000)
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 !important;
  max-width: 100% !important;
  background: #ffffff;
}
</style>
