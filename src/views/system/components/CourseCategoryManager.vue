<template>
  <div class="container">
    <div class="title">
      <span>{{ name }}方向下的课程类别</span>
      <span class="back" @click="backToDirection"
        ><i class="el-icon-arrow-left"></i>返回</span
      >
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <div class="tagBox">
        <div class="iconBox">
          <img
            src="http://localhost:8020/icons/unknown.png"
            alt="哦豁,图片莫得了"
          />
        </div>
        <i class="el-icon-edit-outline"></i>
        <div class="desc">
          <p>JAVA</p>
          <p>一门面向对象的语言</p>
        </div>
      </div>
      <div class="addTag" @click="openCreateDialog">
        <i class="el-icon-plus"></i>
      </div>
    </div>

    <!-- 添加或编辑对话框 -->
    <el-dialog
      :title="isAdd ? '创建课程类别' : '编辑课程类别'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="formData" :rules="rules" ref="addTag">
        <el-form-item label="类别图标">
          <el-upload
            class="avatar-uploader"
            action="#"
            ref="upload"
            :http-request="handlePreview"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="avatar" :src="avatar" class="avatar" />
            <div v-else class="avatar-uploader-icon">
              <i class="el-icon-plus"></i>
              <p>PNG或JPG格式</p>
              <p>图片大小≤500KB</p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类别名称" prop="tagName">
          <el-input v-model="formData.tagName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别描述" prop="tagDesc">
          <el-input v-model="formData.tagDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('addDir')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ListAllTags } from "@/api/System/courseDirection";
import { uploadAndPreview, cancelUpload } from "@/api/common";
export default {
  name: "CourseCategoryManager",
  props: {
    direction: Number,
    name: String,
  },
  data() {
    return {
      rules: {
        tagName: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ],
        tagDesc: [
          { required: true, message: "类别描述不能为空", trigger: "blur" },
        ],
      },
      isAdd: true,
      dialogFormVisible: false,
      formData: {
        tagName: "",
        tagDesc: "",
        iconImage: "",
      },
      avatar: "",
      hasUpload: false,
      tmpImage: "", // 缓存中的图片
    };
  },
  methods: {
    backToDirection() {
      this.$emit("showTagsClose");
    },
    openCreateDialog() {
      this.isAdd = true;
      this.hasUpload = false;
      this.dialogFormVisible = true;
    },
    handleAdd(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.FormData.iconImage = this.tmpImage;
        }
      });
    },
    async handlePreview(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      if (this.hasUpload) {
        formData.append("tmp", this.tmpImage);
      }
      try {
        let res = await uploadAndPreview(formData);
        this.hasUpload = true;
        this.avatar = "http://localhost:8020" + res.data.src;
        this.tmpImage = res.data.src;
      } catch (error) {
        this.$message({
          type: "danger",
          message: "服务器故障",
        });
      }
    },
    async handleCancel() {
      if (this.hasUpload) {
        try {
          // 先清理缓存中的图片
          console.log(this.tmpImage);
          let data = this.tmpImage;
          await cancelUpload({ data });
          this.$message({
            type: "success",
            message: "取消成功",
          });
        } catch (error) {
          this.$message({
            type: "danger",
            message: "服务器故障",
          });
        }
      }
      // 初始化表单
      this.hasUpload = false;
      this.formData = {
        tagName: "",
        tagDesc: "",
        iconImage: "",
      };
      this.avatar = "";
      this.tmpImage = "";
      this.dialogFormVisible = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 0.5;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message({
          type: "danger",
          message: "上传头像图片大小不能超过 500KB!",
        });
      }
      return isJPG && isLt2M;
    },
  },
  async created() {
    let res = await ListAllTags(this.direction);
    console.log(res.data);
  },
};
</script>

<style scoped>
.el-divider--horizontal {
  margin: 0;
}

.title {
  height: 59px;
  line-height: 59px;
  color: #3465a2;
  font-size: 16px;
  font-weight: 500;
  text-indent: 40px;
  display: flex;
  justify-content: space-between;
}

.back {
  float: right;
  margin-right: 40px;
  cursor: pointer;
}

.wrap {
  padding: 30px 10px 20px 10px;
  display: flex;
  flex-wrap: wrap;
}

.tagBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 90px;
  margin: 20px;
  cursor: pointer;
}

.iconBox {
  display: flex;
  width: 100px;
  height: 100px;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
    -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #efeeee;
  transition: box-shadow 0.2s ease-out;
  position: relative;
  padding: 32px 0;
}

.iconBox:hover {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 rgba(255, 255, 255, 1),
    inset 18px 18px 30px rgba(0, 0, 0, 0.1),
    inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow 0.2s ease-out;
}

.iconBox:hover img {
  width: 62px;
  transition: width 0.2s ease-out;
}

.tagBox:hover .desc {
  opacity: 1;
  bottom: 15px;
}

.iconBox > img {
  display: block;
  height: 64px;
  transition: width 0.2s ease-out;
}

.desc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
  color: slategray;
  font-weight: 400;
  margin-top: 0;
  position: relative;
  bottom: 50px;
  opacity: 0;
  transition: bottom 0.3s ease, opacity 0.3s ease;
}

.el-icon-edit-outline {
  color: #464646;
  position: relative;
  bottom: 95px;
  left: 35px;
}

.desc > p {
  margin: 0;
}

.addTag {
  position: relative;
  bottom: 15px;
  display: flex;
  width: 100px;
  height: 100px;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
    -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #efeeee;
  transition: box-shadow 0.2s ease-out;
  position: relative;
  padding: 32px 0;
  color: #455a64;
  font-size: 32px;
  cursor: pointer;
}

.addTag:hover {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 rgba(255, 255, 255, 1),
    inset 18px 18px 30px rgba(0, 0, 0, 0.1),
    inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow 0.2s ease-out;
  font-size: 30px;
}

.avatar-uploader-icon {
  border: 1px dashed #efeeee;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
  color: #3465a2;
}
</style>