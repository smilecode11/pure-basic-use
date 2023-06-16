<script lang="ts" setup>
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { formRules } from "./utils/rule";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    code: "",
    remark: ""
  })
});
const formRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return formRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="角色标识" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="备注" prop=" remark">
      <el-input
        v-model="newFormInline.remark"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
  </el-form>
</template>
