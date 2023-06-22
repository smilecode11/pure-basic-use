<template>
  <div class="main">
    <div class="w-[17%] float-left">
      <DeptTree @onDeptSelect="onDeptSelect" />
    </div>
    <div class="w-[82.5%] float-right">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color pl-8 pt-[12px]"
      >
        <el-form-item label="用户名称：" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="请输入用户名称"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号码"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
          >
            <el-option label="已开启" value="0" />
            <el-option label="已关闭" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch(true)"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <PureTableBar
        title="账号管理"
        :columns="columns"
        @refresh="onSearch"
        class="pb-6"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增账号
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            adaptive
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('编辑', row)"
                :icon="useRenderIcon(EditPen)"
              >
                修改
              </el-button>
              <el-popconfirm title="是否确认删除?">
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                    @click="handleDelete(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Role)"
                      >
                        分配角色
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

import { PureTableBar } from "@/components/RePureTableBar";
import DeptTree from "./deptTree.vue";
import { useAccount } from "./hook";
export default defineComponent({
  name: "SystemAccount",
  components: { DeptTree, PureTableBar },
  setup() {
    const {
      form,
      formRef,
      buttonClass,
      loading,
      pagination,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      dataList,
      columns,
      resetForm,
      onSearch,
      openDialog,
      handleDelete
    } = useAccount();

    //  部门选择修改参数
    const onDeptSelect = (deptId: number) => {
      console.log("_onDeptSelect", deptId);
      form.deptId = deptId;
      onSearch();
    };

    return {
      useRenderIcon,
      form,
      formRef,
      resetForm,
      onSearch,
      openDialog,
      handleDelete,
      dataList,
      columns,
      buttonClass,
      loading,
      pagination,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      onDeptSelect,
      Role,
      Password,
      More,
      Delete,
      EditPen,
      Search,
      Refresh,
      AddFill
    };
  }
});
</script>

<style lang="scss" scoped>
.main {
  margin: 8px !important;
}
:deep(.el-table) {
  // height: 718px !important;
}
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
