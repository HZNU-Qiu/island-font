<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>创建课程</p>
        </div>
      </div>
      <div class="main">
        <el-form
          label-position="right"
          :model="formData"
          :rules="rules"
          ref="courseForm"
          class="courseForm"
          style="max-width: 50%; margin-left: 30px"
        >
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="课程描述" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入内容"
              v-model="formData.description"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="课程须知" prop="notice">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入内容"
              v-model="formData.notice"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="课程目标" prop="objectives">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入内容"
              v-model="formData.objectives"
            >
            </el-input>
          </el-form-item>
          <el-row :gutter="80">
            <el-col :span="11">
              <el-form-item label="是否可见">
                <el-switch
                  v-model="formData.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="课程难度" prop="difficulty">
                <el-select
                  v-model="formData.difficulty"
                  placeholder="请选择课程难度"
                >
                  <el-option label="简单" value="1"></el-option>
                  <el-option label="中等" value="2"></el-option>
                  <el-option label="困难" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="方向&类别" prop="optionValue">
            <el-cascader
              :options="optionData"
              :key="cascaderKey"
              v-model="optionValue"
              class="cascader"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-button @click="handleSubmit('courseForm')" type="primary" plain
            >创建课程</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getTree } from "@/api/System/courseDirection";
import { createCourse } from "@/api/Teacher/courseManage";
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入课程描述", trigger: "blur" },
        ],
        difficulty: [
          { required: true, message: "请选择课程难度", trigger: "blur" },
        ],
        notice: [
          { required: true, message: "请输入课程须知", trigger: "blur" },
        ],
        objectives: [
          { required: true, message: "请输入课程目标", trigger: "blur" },
        ],
      },
      formData: {
        name: "",
        description: "",
        difficulty: "",
        notice: "",
        objectives: "",
        status: 0,
      },
      cascaderKey: 1,
      optionValue: [],
      optionData: [],
    };
  },
  watch: {
    optionData() {
      ++this.cascaderKey;
    },
  },
  methods: {
    _resetForm() {
      this.formData = {
        name: "",
        description: "",
        difficulty: "",
        notice: "",
        objectives: "",
        status: 0,
      }
      this.optionValue = []
    },
    handleChange(value) {
      this.optionValue = value;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.optionValue.length === 2) {
          this.formData.directionId = this.optionValue[0];
          this.formData.categoryId = this.optionValue[1];
          this.formData.status = this.formData.status === true ? 1 : 0;
          try {
            await createCourse(this.formData);
            this._resetForm()
            this.$message({
              type: "success",
              message: "添加成功",
            });
          } catch (error) {
            console.log(error)
            this.$message({
              type: "warning",
              message: "创建失败",
            });
          }
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

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  box-shadow: 0px 0px 12px 1px #aaa;
  min-height: 800px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
  border-bottom: 1px solid #dae1ed;
}

.header-left > p {
  font-size: 24px;
  font-weight: 500;
  color: #3465a2;
}
</style>