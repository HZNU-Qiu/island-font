<template>
  <div class="container">
    <div class="title">
      <span>更改{{ this.oldData.teacherName }}的校内信息</span>
      <span class="back" @click="back"
        ><i class="el-icon-arrow-left"></i>返回</span
      >
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form
            :model="formData"
            status-icon
            ref="formData"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="教师照片">
              <el-upload
                class="avatar-uploader"
                action="#"
                ref="upload"
                :http-request="UploadImage"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :data="{ oldAvatar, id }"
              >
                <img v-if="avatar" :src="avatar" class="avatar" />
                <div v-else class="avatar-uploader-icon">
                  <i class="el-icon-plus"></i>
                  <p>PNG或JPG格式</p>
                  <p>图片大小≤2Mb</p>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="校内信息">
              <el-cascader
                :options="optionData"
                :key="cascaderKey"
                v-model="optionValue"
                class="cascader"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('formData')"
                >保 存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTree2 } from "@/api/System/universityManage";
import { modifyTeacherStatus, changeStudentAvatar } from "@/api/System/userManage";
export default {
  name: "ModifyTeacherStatus",
  props: {
    oldData: Object,
  },
  data() {
    return {
      formData: {
        universityId: "",
        schoolId: "",
        departmentId: ""
      },
      cascaderKey: 1,
      optionValue: [],
      optionData: [],
      oldAvatar: "",
      avatar: "",
      id: "",
    };
  },
  watch: {
    //饿了么的Cascader有问题，切换数据源
    optionData() {
      ++this.cascaderKey;
    },
  },
  async mounted() {
    let op = await getTree2();
    this.optionData = op.data;
    this.optionValue = [
      this.oldData.universityID,
      this.oldData.schoolID,
      this.oldData.departmentID,
    ];
    this.avatar = "http://localhost:8020" + this.oldData.oldAvatar;
    this.oldAvatar = this.oldData.oldAvatar;
    this.id = this.oldData.id
  },
  methods: {
    back() {
      this.$emit("modifyClose");
    },
    handleChange(value) {
      this.optionValue = value;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async UploadImage(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      formData.append("oldAvatar", param.data.oldAvatar);
      formData.append("id", param.data.id);
      let res = await changeStudentAvatar(formData);
      this.avatar = 'http://localhost:8020' + res.data
      this.oldData = this.avatar
      this.$message({
          type: 'success',
          message: '上传成功'
      })
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.optionValue.length === 3) {
          this.formData.universityId = this.optionValue[0];
          this.formData.schoolId = this.optionValue[1];
          this.formData.departmentId = this.optionValue[2];
          this.formData.id = this.id
          try {
            await modifyTeacherStatus(this.formData);
            this.$emit("editClose");
            this.$message({
              type: "success",
              message: "添加成功",
            });
          } catch (error) {
            console.log(error);
            this.$message({
              type: "warning",
              message: "服务故障",
            });
          }
        }
      });
    },
  },
};
</script>

<style>
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

.wrap {
  padding: 20px;
}
.submit {
  float: left;
}

.back {
  float: right;
  margin-right: 40px;
  cursor: pointer;
}

.cascader {
  width: 100%;
}

.avatar-uploader > .el-upload {
  border: 1px dashed #3465a2;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 0 0 30px 0px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 12px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader-icon > p {
  margin: 0;
  padding: 0;
}
.avatar-uploader-icon > i {
  font-size: 28px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>