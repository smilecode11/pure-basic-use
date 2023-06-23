<script lang="ts" setup>
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { formRules } from "./utils/rule";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    code: "",
    remark: "",
    menu: [],
    status: "0"
  }),
  allMenus: () => []
});

interface Tree {
  name: string;
}
/** 监听菜单树改变*/
const onCheckByMenu = (data: Tree, { checkedKeys }) => {
  // console.log("_onCheck checkedKeys", checkedKeys);
  newFormInline.value.menu = checkedKeys;
};
const formRef = ref();
const newFormInline = ref(props.formInline);
const allMenus = ref(props.allMenus);

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
        placeholder="请输入角色名称(示例: 管理员)"
      />
    </el-form-item>
    <el-form-item label="角色标识" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入角色标识(示例: admin)"
      />
    </el-form-item>
    <el-form-item label="角色备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        clearable
        type="textarea"
        placeholder="请输入备注信息(示例: 管理员具备中后台基础管理能力)"
      />
    </el-form-item>
    <el-form-item label="角色状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio-button label="0">启用</el-radio-button>
        <el-radio-button label="1">禁用</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="菜单权限" prop="menu">
      <el-scrollbar max-height="320px">
        <template v-if="allMenus.length">
          <el-tree
            style="width: 100%"
            node-key="id"
            check-strictly
            :data="allMenus"
            :props="{ children: 'children', label: 'menuName' }"
            show-checkbox
            :default-checked-keys="newFormInline.menu"
            default-expand-all
            @check="onCheckByMenu"
          />
        </template>
        <tempalte v-else>
          <el-empty description="暂无菜单分配" />
        </tempalte>
      </el-scrollbar>
    </el-form-item>
  </el-form>
</template>
