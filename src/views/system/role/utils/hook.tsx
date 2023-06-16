import { reactive, ref, h, onMounted, toRaw } from "vue";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import editForm from "../form.vue";

import { FormItemProps } from "./types";
import { type PaginationProps } from "@pureadmin/table";
import { usePublicHooks } from "../../hooks";

import { getRoleList } from "@/api/system";

export function useRole() {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const switchLoadMap = ref({});
  const loading = ref(true);
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
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
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.status === 0 ? "停用" : "启用"}${row.name}`, {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }
  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "id",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "code",
      minWidth: 150
    },
    {
      label: "状态",
      minWidth: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];
  const dataList = ref([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  async function onSearch() {
    console.log("_onSearch", form);
    loading.value = true;
    //  获取表格数据
    const { data } = await getRoleList(toRaw(form));
    console.log("_getRoleList", data);
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          code: row?.code ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        console.log("_FormRef", FormRef, curData);
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  const handleDelete = row => {
    console.log("_handleDelete", row);
  };
  const handleDatabase = () => {
    console.log("_handleDatabase");
  };
  const handleMenu = () => {
    console.log("_handleMenu");
  };
  const buttonClass = () => {
    console.log("_buttonClass");
  };
  const handleSelectionChange = () => {
    console.log("_handleSelectionChange");
  };
  const handleSizeChange = () => {
    console.log("_handleSizeChange");
  };
  const handleCurrentChange = () => {
    console.log("_handleCurrentChange");
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    onSearch,
    resetForm,
    openDialog,
    columns,
    dataList,
    pagination,
    handleDelete,
    handleDatabase,
    handleMenu,
    buttonClass,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
