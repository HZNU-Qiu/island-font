<template>
  <div class="container">
    <transition name="info" mode="out-in">
      <div v-if="!hasgreeted" class="greeting">
        <h1>您好，欢迎来到“旧岛”</h1>
        <p>在您登岛之前，还请您能够补全您的身份信息</p>
        <el-button
          icon="el-icon-right"
          circle
          @click="hasgreeted = !hasgreeted"
        ></el-button>
      </div>
      <el-form
        v-if="hasgreeted"
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="infoForm"
      >
        <el-form-item prop="realName" label="真实姓名">
          <el-input
            v-model="formData.realName"
            placeholder="真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio-button label="1" size="medium"
              ><i class="el-icon-male">男</i></el-radio-button
            >
            <el-radio-button label="2" size="medium"
              ><i class="el-icon-female">女</i></el-radio-button
            >
          </el-radio-group>
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
        <el-button
          type="success"
          style="width: 300px; font-size: 16px; font-weight: 500; margin-top: 20px"
          @click="handleSubmit('formData')"
          plain
          >保存信息</el-button
        >
      </el-form>
    </transition>
  </div>
</template>

<script>
import { getTree } from "@/api/System/universityManage";
import { completeInfo } from "@/api/Student/infoComplete";
export default {
  data() {
    return {
      rules: {
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
      },
      cascaderKey: 1,
      hasgreeted: false,
      formData: {
        realName: "",
        sex: "",
        universityId: "",
        schoolId: "",
        departmentId: "",
        majorId: "",
        classId: "",
      },
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
  methods: {
    handleChange(value) {
      this.optionValue = value;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.optionValue.length === 5) {
          this.formData.universityId = this.optionValue[0];
          this.formData.schoolId = this.optionValue[1];
          this.formData.departmentId = this.optionValue[2];
          this.formData.majorId = this.optionValue[3];
          this.formData.classId = this.optionValue[4];
          completeInfo(this.formData)
            .then((res) => {
              if (res.code === 200) {
                this.$router.push({ path: "/home" });
              } else {
                this.$router.push({ path: "/infoComplete" });
              }
            })
            .catch((err) => {
              console.log(err)
              this.$message({
                type: "warning",
                message: "系统异常",
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "请填写校内信息",
          });
        }
      });
    },
  },
  created() {
    getTree().then((res) => {
      this.optionData = res.data;
    });
  },
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#99f, #f99);
}

.greeting > h1 {
  color: #fafafa;
  font-weight: 500;
  font-size: 42px;
  text-shadow: 3px 3px 5px #9ce;
}

.greeting > p {
  color: #fafafa;
  font-weight: 400;
  font-size: 28px;
  text-shadow: 3px 3px 5px #9ce;
  margin: 30px;
}

.greeting {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.greeting > .el-button.is-circle {
  border-radius: 50%;
  padding: 12px;
  background: rgb(255, 255, 255, 0);
  border: 4px solid #fafafa;
  color: #fafafa;
  font-size: 26px;
}

.greeting > .el-button.is-circle:hover {
  transform: rotate(-90deg);
}

.info-leave-active {
  animation: bounce-in 1s;
}

.info-enter-active {
  animation: bounce-in 1s reverse;
}

.infoForm {
  width: 380px;
  height: 480px;
  padding: 40px;
  position: relative;
  z-index: 100;
  background: inherit;
  border-radius: 18px;
  overflow: hidden;
}

.infoForm::before {
  content: "";
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  background: inherit;
  box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.25);
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: -1;
  filter: blur(6px);
  overflow: hidden;
}

.cascader {
  width: 300px;
}

@keyframes bounce-in {
  20% {
    transform: translateY(-40px);
  }
  50% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(-520px);
  }
}

.el-icon-male,
.el-icon-female {
  font-size: 16px;
  font-weight: 600;
  color: #757575;
}
</style>