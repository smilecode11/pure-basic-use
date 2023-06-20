<script lang="ts" setup>
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { formRules } from "./utils/rule";
import IconSelect from "@/components/ReIcon/src/Select.vue";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    title: "",
    status: "0",
    type: "0",
    hiddenTag: "0"
  }),
  allMenus: () => []
});

const formRef = ref();
const newFormInline = ref(props.formInline);
const allMenus = ref(props.allMenus);

const onMenuClick = data => {
  newFormInline.value.parentMenu = data.id;
};

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
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="newFormInline.type">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入菜单名称(如: 安全管理)"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单标识" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入菜单标识(如: Fighting) [注意]外链写法 https://www.baidu.com"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="图标" prop="icon">
          <IconSelect v-model="newFormInline.icon" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="路由地址" prop="routePath">
          <el-input
            v-model="newFormInline.routePath"
            clearable
            placeholder="请输入路由地址(如: /fighting)"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="重定向地址" prop="redirectRoutePath">
          <el-input
            v-model="newFormInline.redirectRoutePath"
            clearable
            placeholder="请输入重定向地址(如: /fighting/list)"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="iframeLink" prop="frameSrc">
          <el-input
            v-model="newFormInline.frameSrc"
            clearable
            placeholder="请输入iframe链接(如: https://www.baidu.com)"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="路由组件" prop="component">
          <el-input
            v-model="newFormInline.component"
            clearable
            placeholder="请输入路由组件(如: fighting/index => fighting/index.vue)"
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
      <re-col>
        <el-form-item label="上级菜单" prop="parentMenu">
          <el-scrollbar max-height="320px">
            <template v-if="allMenus.length">
              <el-tree
                ref="treeRef"
                node-key="id"
                :data="allMenus"
                :props="{ children: 'children', label: 'menuName' }"
                :expand-on-click-node="false"
                highlight-current
                default-expand-all
                :current-node-key="newFormInline.parentMenu"
                @current-change="onMenuClick"
              />
            </template>
            <tempalte v-else>
              <el-empty description="暂无菜单分配" />
            </tempalte>
          </el-scrollbar>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示父级" prop="showParent">
          <el-radio-group v-model="newFormInline.showParent">
            <el-radio-button label="0">显示</el-radio-button>
            <el-radio-button label="1">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="在菜单显示" prop="showLink">
          <el-radio-group v-model="newFormInline.showLink">
            <el-radio-button label="0">是</el-radio-button>
            <el-radio-button label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="面包屑隐藏" prop="hiddenTag">
          <el-radio-group v-model="newFormInline.hiddenTag">
            <el-radio-button label="0">显示</el-radio-button>
            <el-radio-button label="1">不显示</el-radio-button>
          </el-radio-group>
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
    </el-row>
  </el-form>
</template>
