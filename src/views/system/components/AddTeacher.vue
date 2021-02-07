<template>
  <div class="container">
    <div class="title">
      <span>创建教师用户</span>
      <span class="back" @click="back"
        ><i class="el-icon-arrow-left"></i>返回</span
      >
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form
            :rules="rules"
            :model="formData"
            status-icon
            ref="formData"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                size="medium"
                v-model="formData.username"
                placeholder="请填写用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realname">
              <el-input
                size="medium"
                v-model="formData.realname"
                placeholder="请填写姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password1">
              <el-input
                size="medium"
                v-model="formData.password1"
                placeholder="请填写用户密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" prop="email">
              <el-input
                size="medium"
                placeholder="请输入邮箱"
                v-model="formData.email"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="formData.sex" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
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
              <el-button @click="resetForm('formData')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTree2 } from "@/api/System/universityManage";
import { addTeacher } from "@/api/System/userManage";
export default {
  name: "TeacherAddition",
  data() {
    return {
      rules: {
        username: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
        ],
        realname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        password1: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      formData: {
        username: "",
        realname: "",
        password1: "",
        sex: "",
        email: "",
        universityId: "",
        schoolId: "",
        departmentId: "",
      },
      cascaderKey: 1,
      optionValue: [],
      optionData: [],
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
  },
  methods: {
    back() {
      this.$emit("editClose");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.optionValue = []
    },
    handleChange(value) {
      this.optionValue = value;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.optionValue.length === 3) {
          this.formData.universityId = this.optionValue[0];
          this.formData.schoolId = this.optionValue[1];
          this.formData.departmentId = this.optionValue[2];
          try {
            await addTeacher(this.formData);
            this.$emit("editClose")
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
</style>