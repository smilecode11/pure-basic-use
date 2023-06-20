<script lang="ts" setup>
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { formRules } from "./utils/rule";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    title: "",
    status: "0",
    type: "0",
    hiddenTag: "0"
  }),
  allDepts: () => []
});

const formRef = ref();
const newFormInline = ref(props.formInline);
const allDepts = ref(props.allDepts);

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
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="上级部门" prop="parentDept">
          <el-cascader
            class="w-full"
            v-model="newFormInline.parentDept"
            :options="allDepts"
            :props="{
              value: 'id',
              label: 'deptName',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.deptName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门负责人" prop="head">
          <el-input
            v-model="newFormInline.head"
            clearable
            placeholder="请输入部门负责人"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="headMobile">
          <el-input
            v-model="newFormInline.headMobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="headEmail">
          <el-input
            v-model="newFormInline.headEmail"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序" prop="rank">
          <el-input-number
            v-model="newFormInline.rank"
            :min="0"
            :max="9999"
            controls-position="right"
            placeholder="请输入排序权重(如: 99)"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="newFormInline.status">
            <el-radio-button label="0">启用</el-radio-button>
            <el-radio-button label="1">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            type="textarea"
            clearable
            placeholder="请输入备注"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
