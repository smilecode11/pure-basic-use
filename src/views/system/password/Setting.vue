<template>
  <div class="setting-control">
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input clearable v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input clearable v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit(formRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { updateUserInfo } from "@/api/system";
import { getUserInfo } from "@/api/user";

export default defineComponent({
  setup() {
    const form = reactive({
      nickname: "",
      phone: "",
      email: ""
    });
    const formRef = ref<FormInstance>();
    const handleSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate(async valid => {
        if (valid) {
          updateUserInfo(toRaw(form)).then(resp => {
            console.log("_updateUserInfo", resp);
            if (resp.errno === 0) {
              message(`${resp.data.msg}`, { type: "success" });
              useUserStoreHook().getUserInfo(); // 更新用户
            }
          });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };

    const checkPhone = (rule, value, callback) => {
      if (!/^1[3-9]\d{9}$/.test(value)) {
        callback("请输入正确格式手机号");
      } else {
        callback();
      }
    };
    const checkEmail = (rule, value, callback) => {
      if (!/[\w.]+@\w+\.(com|net|edu)/.test(value)) {
        callback("请输入正确邮箱");
      } else {
        callback();
      }
    };
    const rules = reactive<FormRules>({
      nickname: [
        {
          required: true,
          message: "输入昵称",
          trigger: "blur"
        }
      ],
      phone: [
        {
          required: true,
          message: "输入手机号",
          trigger: "blur"
        },
        {
          validator: checkPhone,
          trigger: ["blur", "change"]
        }
      ],
      email: [
        {
          required: true,
          message: "输入邮箱",
          trigger: "blur"
        },
        {
          validator: checkEmail,
          trigger: ["blur", "change"]
        }
      ]
    });

    const initForm = async () => {
      const userResp = await getUserInfo();
      const { errno, data } = userResp;
      if (errno === 0) {
        form.email = data.email;
        form.phone = data.phone;
        form.nickname = data.nickname;
      }
    };

    onMounted(async () => {
      initForm();
    });

    return {
      formRef,
      form,
      rules,
      handleSubmit
    };
  }
});
</script>

<style scoped lang="scss">
#weak,
#medium,
#strong {
  display: inline-block;
  height: 15px;
  width: 60px;
  border-top: 4px solid gainsboro;
  margin-left: 5px;
  font-size: 12px;
  text-align: center;
  transition: 0.3s;
  &.weak {
    border-color: yellow;
  }
  &.medium {
    border-color: blue;
  }
  &.strong {
    border-color: green;
  }
}
</style>
