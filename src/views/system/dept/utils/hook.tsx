import { onMounted, reactive, ref, h, toRaw } from "vue";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { List2tree } from "../../utils";
import { FormItemProps } from "./types";
import { type PaginationProps } from "@pureadmin/table";
import { clone } from "@pureadmin/utils";
const deepClone = obj => clone(obj, true);

import editForm from "../form.vue";
import {
  createDept,
  getAllDeptWithLevel,
  setDeptStatus,
  editDeptItem,
  deleteDept
} from "@/api/system";

export function useDept() {
  const form = reactive({
    name: "",
    status: "",
    pageSize: 10,
    currentPage: 1
  });
  const formRef = ref();
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "name",
      formatter: ({ name, id }) => `${name}_${id}`
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"0"}
          active-text="已启用"
          inactive-value={"1"}
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onStatusChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];
  const dataList = ref([]); //  数据列表数据
  const treeDepts = ref([]); //  上级部门数据
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 25, 50, 100, 500]
  });
  const onSearch = async (resetCurrentPage?: boolean) => {
    if (resetCurrentPage) {
      form.currentPage = 1;
      pagination.currentPage = 1;
    }
    loading.value = true;
    //  获取部门数据
    const { data } = await getAllDeptWithLevel(toRaw(form));
    dataList.value = data;
    //  合成上级部门数据
    treeDepts.value = List2tree(deepClone(data), {
      labelKey: "deptName",
      nameKey: "name"
    });
    loading.value = false;
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch(true);
  };

  /** 角色状态启用/停用*/
  function onStatusChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === "1" ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const { id, status } = row;
        const { errno, msg } = await setDeptStatus({ id, status });
        if (errno === 0) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.status === "1" ? "停用" : "启用"}${row.name}`, {
            type: "success"
          });
          // console.log("_data", data);
        } else {
          message(`${msg}`, {
            type: "error"
          });
        }
      })
      .catch(() => {
        row.status === "0" ? (row.status = "1") : (row.status = "0");
      });
  }
  /**  编辑/新增部门弹窗*/
  const openDialog = (title = "新增", row?: FormItemProps) => {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          id: row?.id ?? "",
          name: row?.name ?? "",
          rank: row?.rank ?? 99,
          remark: row?.remark ?? "",
          head: row?.head ?? "",
          headMobile: row?.headMobile ?? "",
          headEmail: row?.headEmail ?? "",
          parentDept: row?.parentDept ?? 0,
          status: row?.status ?? "0"
        },
        allDepts: treeDepts
      },
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        // console.log("_FormRef", curData);
        function chores() {
          message(`${title}成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (title === "新增") {
              const addResp = await createDept(curData); //  新增部门
              // console.log("_addResp", addResp);
              if (addResp.errno === 0) {
                chores();
              } else {
                message(addResp.msg, {
                  type: "error"
                });
              }
              chores();
            } else {
              const editResp = await editDeptItem(curData); //  编辑部门
              if (editResp.errno === 0) {
                chores();
              } else {
                message(editResp.msg, {
                  type: "error"
                });
              }
            }
          }
        });
      }
    });
  };
  const handleDelete = async row => {
    await deleteDept({ id: row.id });
    onSearch();
  };
  onMounted(() => {
    onSearch();
  });
  return {
    form,
    onSearch,
    loading,
    resetForm,
    columns,
    openDialog,
    dataList,
    pagination,
    handleDelete
  };
}
