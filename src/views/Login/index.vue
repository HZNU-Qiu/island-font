<template>
  <div class="container1">
    <transition name="sign" mode="out-in">
      <el-form
        v-if="islogin"
        ref="loginData"
        :rules="rules1"
        :model="loginData"
        class="login-form"
      >
        <h2>登录</h2>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginData.username"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginData.password"
            placeholder="密码"
          />
        </el-form-item>
        <el-button id="loginBtn" @click="handleLogin('loginData')"
          >登录</el-button
        >
        <el-button id="registerBtn" type="button" @click="islogin = !islogin">
          注册
        </el-button>
      </el-form>

      <el-form
        v-if="!islogin"
        :model="registerData"
        ref="registerData"
        :rules="rules2"
        class="register-form"
      >
        <h2>注册</h2>
        <el-form-item prop="username1">
          <el-input
            type="text"
            v-model="registerData.username1"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="registerData.pass"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="checkpass">
          <el-input
            type="password"
            v-model="registerData.checkpass"
            placeholder="请确认密码"
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            type="email"
            v-model="registerData.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-button id="completeBtn" @click="handleRegister('registerData')">
          完成注册
        </el-button>
        <el-button id="cancelBtn" @click="islogin = !islogin"> 取消 </el-button>
      </el-form>
    </transition>
  </div>
</template>

<script>
import { register } from "@/api/common";
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入用户名"));
      } else if (
        this.registerData.username1.length < 2 ||
        this.registerData.username1.length > 32
      ) {
        return callback(new Error("用户名长度应该在2-32位之间"));
      } else {
        if (/^\w+$/.test(this.registerData.username1) === false) {
          return callback(new Error("用户名应由字母数字下划线组成"));
        }
        return callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      } else {
        if (
          this.registerData.pass.length < 8 ||
          this.registerData.pass.length > 32
        ) {
          return callback(new Error("密码长度应为8-32位"));
        } else {
          if (this.registerData.checkpass !== "") {
            this.$refs.registerData.validateField("checkpass");
          }
          return callback();
        }
      }
    };
    let validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请再次输入密码"));
      } else {
        if (value !== this.registerData.pass) {
          return callback(new Error("两次输入密码不一致!"));
        } else {
          return callback();
        }
      }
    };
    return {
      islogin: true,
      loginData: {
        username: "",
        password: "",
      },
      registerData: {
        username1: "",
        pass: "",
        checkpass: "",
        email: "",
      },
      rules1: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      rules2: {
        username1: [{ validator: validateUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkpass: [{ validator: validateCheckPass, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱地址格式不正确", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleLogin(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("Login", this.loginData)
            .then((response) => {
              let res = response.data;
              let user = res.user;
              if (user.type === 4 && !user.isComplete) {
                this.$router.push({ path: "/completeInfo" });
              } else {
                this.$router.push({ path: "/home" });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("登录失败");
            });
        }
      });
    },
    handleRegister(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          register(this.registerData)
            .then((res) => {
              this.$message({
                type: "success",
                message: "注册成功！",
              });
              this.$refs.registerData.resetFields();
              this.islogin = true;
            })
            .catch((err) => {
              this.$message.error("注册失败");
            });
        }
      });
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.container1 {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("./image/island.jpg") no-repeat fixed;
  background-size: cover;
}

.login-form {
  width: 300px;
  height: 310px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 100;
  background: inherit;
  border-radius: 18px;
  overflow: hidden;
  transition: 0.7s;
}

.login-form::before {
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

.login-form h2 {
  font-size: 20px;
  font-weight: 400;
  color: #fff;
}

.el-form-item {
  margin-bottom: 0px;
}

.el-form-item__error {
  top: 87%;
  padding-top: 0;
}

.el-button + .el-button {
  margin-left: 0;
}

.login-form input,
.login-form button {
  margin: 6px 0;
  width: 100%;
  height: 36px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0 14px;
  color: #3d5245;
}

.login-form input::placeholder {
  color: #3d5245;
}

#loginBtn {
  margin-top: 24px;
  background-color: rgba(57, 88, 69, 0.4);
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
}

#loginBtn:hover {
  background-color: rgba(10, 71, 34, 0.733);
}

#loginBtn:focus {
  outline: 0;
}

#loginBtn::before,
#loginBtn::after {
  content: "";
  display: block;
  width: 80px;
  height: 100%;
  background: rgb(243, 252, 246);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  transform: skewX(-15deg);
  filter: blur(30px);
  overflow: hidden;
  transform: translateX(-100px);
}

#loginBtn::after {
  width: 40px;
  background: rgb(254, 255, 254);
  left: 60px;
  opacity: 0;
}

#loginBtn:hover::before {
  transition: 1s;
  transform: translateX(320deg);
  opacity: 0.7;
}

#loginBtn:hover::after {
  transition: 1s;
  transform: translateX(320px);
  opacity: 1;
}

#registerBtn {
  margin-top: 5px;
  background-color: rgba(44, 143, 236, 0.4);
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
}

#registerBtn:hover {
  background-color: rgba(14, 124, 214, 0.733);
}

#registerBtn:focus {
  outline: 0;
}

#registerBtn::before,
#registerBtn::after {
  content: "";
  display: block;
  width: 80px;
  height: 100%;
  background: rgb(243, 252, 246);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  transform: skewX(-15deg);
  filter: blur(30px);
  overflow: hidden;
  transform: translateX(-100px);
}

#registerBtn::after {
  width: 40px;
  background: rgb(254, 255, 254);
  left: 60px;
  opacity: 0;
}

#registerBtn:hover::before {
  transition: 1s;
  transform: translateX(320deg);
  opacity: 0.7;
}

#registerBtn:hover::after {
  transition: 1s;
  transform: translateX(320px);
  opacity: 1;
}

/*注册模块样式*/
.register-form {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 100;
  background: inherit;
  border-radius: 18px;
  overflow: hidden;
  transition: 0.7s;
}

.register-form::before {
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

.register-form h2 {
  font-size: 20px;
  font-weight: 400;
  color: #fff;
}

.register-form input,
.register-form button {
  margin: 6px 0;
  height: 36px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0 14px;
  color: #3d5245;
}

.register-form input::placeholder {
  color: #3d5245;
}

#completeBtn {
  margin-top: 24px;
  background-color: rgba(57, 88, 69, 0.4);
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
}

#completeBtn:hover {
  background-color: rgba(10, 71, 34, 0.733);
}

#completeBtn:focus {
  outline: 0;
}

#completeBtn::before,
#completeBtn::after {
  content: "";
  display: block;
  width: 80px;
  height: 100%;
  background: rgb(243, 252, 246);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  transform: skewX(-15deg);
  filter: blur(30px);
  overflow: hidden;
  transform: translateX(-100px);
}

#completeBtn::after {
  width: 40px;
  background: rgb(254, 255, 254);
  left: 60px;
  opacity: 0;
}

#completeBtn:hover::before {
  transition: 1s;
  transform: translateX(320deg);
  opacity: 0.7;
}

#completeBtn:hover::after {
  transition: 1s;
  transform: translateX(320px);
  opacity: 1;
}

#cancelBtn {
  margin-top: 5px;
  background-color: rgba(44, 143, 236, 0.4);
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
}

#cancelBtn:hover {
  background-color: rgba(14, 124, 214, 0.733);
}

#cancelBtn:focus {
  outline: 0;
}

#cancelBtn::before,
#cancelBtn::after {
  content: "";
  display: block;
  width: 80px;
  height: 100%;
  background: rgb(243, 252, 246);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  transform: skewX(-15deg);
  filter: blur(30px);
  overflow: hidden;
  transform: translateX(-100px);
}

#cancelBtn::after {
  width: 40px;
  background: rgb(254, 255, 254);
  left: 60px;
  opacity: 0;
}

#cancelBtn:hover::before {
  transition: 1s;
  transform: translateX(320deg);
  opacity: 0.7;
}

#cancelBtn:hover::after {
  transition: 1s;
  transform: translateX(320px);
  opacity: 1;
}

.sign-leave-active {
  animation: switch 1.5s;
}

.sign-enter-active {
  animation: switch 1.5s reverse;
}

@keyframes switch {
  20% {
    transform: rotateX(-30deg);
  }
  100% {
    transform: rotateX(180deg);
  }
}
</style>