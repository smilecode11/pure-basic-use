<template>
  <div class="avatar-control flex flex-col p-4">
    <el-avatar :size="120" :src="avatarUrl" />
    <el-button class="mt-4" style="width: 120px" @click="handleOpenModal">
      更换头像
    </el-button>

    <input
      style="display: none"
      type="file"
      accept="image/*"
      id="imgReader"
      ref="imgReader"
      @change="onImageChange"
    />

    <el-dialog
      v-model="avatarModalShow"
      title="更换头像"
      width="520px"
      draggable
    >
      <div class="control">
        <div class="image-cropper">
          <img :src="sourceImage" class="processed-image" ref="cropperImgRef" />
        </div>
        <div class="image-view">
          <div class="previewText">裁剪预览</div>
          <div class="previewBox" ref="previewBoxRef" />
          <div class="previewBoxRound" ref="previewBoxRoundRef" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleHideModal">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { editAvatar } from "@/api/system";

export default defineComponent({
  setup() {
    const imgReader = ref<HTMLInputElement | null>(null);
    const cropperImgRef = ref<HTMLImageElement | null>(null);
    const previewBoxRef = ref<null | HTMLImageElement>(null);
    const previewBoxRoundRef = ref<null | HTMLImageElement>(null);
    let uploadFile: File;
    const sourceImage = ref<string>("");
    const cropperImg = ref<string>("");
    let CROPPER: Cropper;
    const avatarModalShow = ref(false);
    const avatarUrl = ref(
      useUserStoreHook().avatar ||
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    );
    const onImageChange = async ev => {
      const reader = new FileReader();
      uploadFile = ev.target.files[0];
      if (uploadFile) {
        //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
        reader.readAsDataURL(uploadFile);
        reader.onload = () => {
          const dataUrl = reader.result;
          sourceImage.value = dataUrl as string;
          // 弹窗显示
          avatarModalShow.value = true;
        };
      }
    };
    const handleOpenModal = () => {
      if (!imgReader.value) return;
      imgReader.value.click();
    };
    const handleHideModal = () => {
      avatarModalShow.value = false;
    };
    const handleConfirm = () => {
      uploadAvatar();
    };
    /** 上传头像*/
    const uploadAvatar = () => {
      //  裁剪数据转化为 blob 传输给后端
      CROPPER.getCroppedCanvas({
        maxWidth: 460,
        maxHeight: 460,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high" //  中等质量 medium 高质量 high
      }).toBlob(blob => {
        const formData = new FormData();
        // 第三个参数为文件名，可选填.
        formData.append("file", blob as Blob, uploadFile.name);
        axios
          .post(`http://127.0.0.1:7001/pureApi/upload-img2`, formData, {
            headers: {
              "Content-Type": "mutipart/form-data"
            },
            timeout: 10000
          })
          .then(resp => {
            // console.log("_then", resp);
            if (resp.data.errno !== 0) {
              return Promise.reject(resp);
            }
            //  设置用户头像
            editAvatar({ avatar: resp.data.data.url }).then(resp => {
              if (resp.errno === 0) {
                useUserStoreHook().getUserInfo(); //  更新用户信息
              } else {
                message(`头像更新失败`, { type: "error" });
              }
            });
            //  赋值展示头像 & 关闭弹窗
            avatarUrl.value = resp.data.data.url;
          })
          .catch(error => {
            message(error.message, { type: "error" });
          })
          .finally(() => {
            handleHideModal();
            //  重置 input value 值, 保证 input change 事件正常触发
            if (imgReader.value) {
              imgReader.value.value = "";
            }
          });
      });
    };

    watch(avatarModalShow, async newValue => {
      await nextTick();
      if (newValue) {
        if (cropperImgRef.value) {
          setTimeout(() => {
            CROPPER = new Cropper(cropperImgRef.value, {
              aspectRatio: 16 / 16, //固定裁剪框的比例（横/竖）,此处16/16则固定为正方形
              minContainerWidth: 300, //容器最小的宽度
              minContainerHeight: 300, //容器最小的高度
              dragMode: "move", //设置裁剪框为可以移动
              preview: [previewBoxRef.value, previewBoxRoundRef.value]
            });
          }, 700);
        }
      } else {
        if (CROPPER) {
          console.log("_destory");
          CROPPER.destroy();
        }
      }
    });

    return {
      imgReader,
      cropperImgRef,
      previewBoxRef,
      previewBoxRoundRef,
      sourceImage,
      cropperImg,
      onImageChange,
      avatarModalShow,
      avatarUrl,
      handleOpenModal,
      handleHideModal,
      handleConfirm
    };
  }
});
</script>

<style lang="scss" scoped>
.control {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.control .image-view {
  min-width: 120px;
  margin-left: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.image-view .previewBox,
.image-view .previewBoxRound {
  overflow: hidden; /*这个超出设置为隐藏很重要，否则就会整个显示出来了*/
  margin-top: 30px;
  box-shadow: 0 0 2px 1px rgba($color: #000000, $alpha: 0.1);
  width: 100px;
  height: 100px;
  border: 1px solid #f2f2f2;
}
.image-view .previewBoxRound {
  border-radius: 50%;
}
</style>
