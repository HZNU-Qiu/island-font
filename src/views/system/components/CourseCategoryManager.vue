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
      <TagBox
        v-for="(sample, index) in tags"
        :key="index"
        :id="sample.id"
        :tagName="sample.name"
        :icon="sample.icon"
        @editThis="handleModify"
      ></TagBox>
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
            <img
              v-if="avatar"
              :src="'http://localhost:8020' + avatar"
              class="avatar"
            />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="isAdd ? handleAdd('addTag') : handleEdit('addTag')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAllTags, addTag, modiftTag } from "@/api/System/courseDirection";
import { uploadAndPreview, cancelUpload } from "@/api/common";
import TagBox from "@/components/TagBox";
export default {
  name: "CourseCategoryManager",
  props: {
    direction: Number,
    name: String,
  },
  components: {
    TagBox,
  },
  data() {
    return {
      rules: {
        tagName: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ],
      },
      tags: [],
      isAdd: true,
      dialogFormVisible: false,
      formData: {
        tagName: "",
        direction: "",
        iconImage: "",
      },
      editData: {
        id: "",
        name: "",
        icon: "",
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
          this.formData.iconImage = this.tmpImage;
          this.formData.direction = this.direction;
          try {
            let res = await addTag(this.formData);
            this.tags.push(res.data);
            this.$message({
              type: "success",
              message: "添加成功",
            });
          } catch (error) {
            this.$message({
              type: "danger",
              message: "服务异常",
            });
          }
          this.dialogFormVisible = false;
          this.formData.iconImage = "";
          this.formData.direction = "";
          this.formData.tagName = "";
          this.tmpImage = "";
          this.hasUpload = false;
          this.avatar = "";
        }
      });
    },
    handleModify(param) {
      this.isAdd = false;
      this.dialogFormVisible = true;
      this.formData.tagName = param.tagName;
      this.avatar = param.icon;
      this.editData.id = param.id;
      this.editData.name = this.formData.tagName;
      this.editData.icon = param.icon;
    },
    handleEdit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (this.hasUpload) {
              this.editData.icon = this.tmpImage;
            }
            await modiftTag(this.editData);
            this.$message({
              type: "success",
              message: "编辑成功",
            });
          } catch (error) {
            this.$message({
              type: "danger",
              message: "服务异常",
            });
          }
          let res = await listAllTags(this.direction);
          this.tags = res.data;
          this.isAdd = false;
          this.dialogFormVisible = false;
          this.formData.iconImage = "";
          this.formData.direction = "";
          this.formData.tagName = "";
          this.tmpImage = "";
          this.hasUpload = false;
          this.avatar = "";
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
        this.avatar = res.data.src;
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
    let res = await listAllTags(this.direction);
    this.tags = res.data;
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
  padding: 50px 10px 20px 10px;
  display: flex;
  flex-wrap: wrap;
}

.addTag {
  position: relative;
  bottom: 2px;
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
  margin-left: 20px;
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