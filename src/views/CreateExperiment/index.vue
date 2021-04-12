<template>
  <div class="panel">
    <div class="header">
      <h2>{{ isModify ? "编辑实验" : "创建一个实验" }}</h2>
    </div>
    <div class="body">
      <el-form label-width="100px" ref="form" label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Display ID" prop="display_id">
              <el-input
                :disabled="isModify"
                placeholder="Display ID"
                v-model="formData.displayId"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="Title" prop="title">
              <el-input
                placeholder="Title"
                v-model="formData.title"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Description" prop="description">
          <Editor v-model="formData.content"></Editor>
        </el-form-item>

        <el-form-item label="Input Description" prop="input_description">
          <Editor v-model="formData.inputDesc"></Editor>
        </el-form-item>

        <el-form-item label="Output Description" prop="output_description">
          <Editor v-model="formData.outputDesc"></Editor>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Time Limit(ms)" prop="time_limit">
              <el-input-number
                style="width: 100%"
                v-model="formData.maxCpuTime"
                controls-position="right"
                :min="100"
                :max="5000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Memory Limit(MB)" prop="memory_limit">
              <el-input-number
                style="width: 100%"
                v-model="formData.maxMemory"
                controls-position="right"
                :min="10"
                :max="256"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Difficulty" prop="difficulty">
              <el-select
                placeholder="Low"
                v-model="formData.difficulty"
                :label="options[formData.difficulty - 1]"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Visible" prop="visible">
              <el-switch
                v-model="formData.status"
                :inactive-value="0"
                :active-value="1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Points" prop="points">
              <el-input-number
                style="width: 100%"
                v-model="formData.point"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 60px">
            <el-form-item label="Languages" prop="languages">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="C"></el-checkbox>
                <el-checkbox label="C++"></el-checkbox>
                <el-checkbox label="Java"></el-checkbox>
                <el-checkbox label="Python3"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          v-for="(sample, index) in samples"
          :key="'sample' + index"
        >
          <TestSamples :title="'Sample' + (index + 1)">
            <el-button
              type="danger"
              size="small"
              :disabled="!needToChange"
              icon="el-icon-delete"
              slot="header"
              @click="removeSample(index)"
              >Delete</el-button
            >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Input_Samples" required>
                  <el-input
                    :rows="5"
                    :disabled="!needToChange"
                    v-model="samples[index].input"
                    type="textarea"
                    :placeholder="
                      index == 0
                        ? 'Input_Samples1 will be shown.Please remember to set mutiple samples'
                        : 'Input_Samples'
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Output_Samples" required>
                  <el-input
                    :rows="5"
                    :disabled="!needToChange"
                    v-model="samples[index].output"
                    type="textarea"
                    :placeholder="
                      index == 0
                        ? 'Output_Samples1 will be shown.Please remember to set mutiple samples'
                        : 'Output_Samples'
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </TestSamples>
        </el-form-item>

        <div class="add-sample-btn">
          <button
            type="button"
            class="add-samples"
            :disabled="!needToChange"
            @click="addSample()"
          >
            <i class="el-icon-plus"></i>
            Add_Sample
          </button>
        </div>

        <el-form-item label="Hint" prop="hint">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="请输入内容"
            v-model="formData.hint"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="CodeTemplate" prop="type">
          <el-switch
            v-model="formData.type"
            :inactive-value="1"
            :active-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <CodeMirror
          :value.sync="formData.template"
          @resetCode="handleReset"
          v-show="formData.type === 2"
        ></CodeMirror>
        <div class="footer">
          <el-button v-if="!isModify" type="success" @click="handleSave" plain>保存</el-button>
          <el-button v-if="isModify" type="success" @click="handleModify" plain>确认修改</el-button>
          <el-button v-if="isModify" type="warning" @click="unlock" plain>{{
            needToChange ? "取消修改" : "修改测试样例"
          }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/Simditor";
import TestSamples from "./components/TestSamples";
import CodeMirror from "@/components/CodeMirror";
import { addExperiment, getDetail, modifyExperiment } from "@/api/experiments";

export default {
  name: "Create",
  components: {
    Editor,
    TestSamples,
    CodeMirror,
  },
  data() {
    return {
      options: [
        { label: "Low", value: 1 },
        { label: "Mid", value: 2 },
        { label: "High", value: 3 },
      ],
      formData: {
        displayId: "",
        title: "",
        content: "",
        inputDesc: "",
        outputDesc: "",
        inputSample: "",
        outputSample: "",
        language: "",
        maxCpuTime: 1000,
        maxMemory: 32,
        type: 2,
        template: "",
        difficulty: 1,
        status: 1,
        point: 100,
        hint: "",
      },
      checkList: ["C", "C++"],
      samples: [{ input: "", output: "" }],
      isModify: false,
      needToChange: false,
      oldSamples: [],
    };
  },
  methods: {
    unlock() {
      if (this.needToChange === true) {
        this.samples = this.oldSamples;
      }
      this.needToChange = !this.needToChange;
    },
    addSample() {
      this.samples.push({ input: "", output: "" });
    },
    removeSample(index) {
      this.samples.splice(index, 1);
    },
    handleReset() {
      this.formData.template = "";
    },
    async handleSave() {
      if (this._validator()) {
        try {
          this.formData.inputSample = this.samples[0].input;
          this.formData.outputSample = this.samples[0].output;
          this.formData.samples = this.samples;
          this.formData.language = this.checkList.join(";");
          let res = await addExperiment(this.formData);
          const loading = this.$loading({
            lock: true,
            text: "正在向服务器写入数据,WAITING~",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          setTimeout(() => {
            loading.close();
          }, 1000);
          if (res.data.flag === false) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success("创建成功");
            this._reset();
            this.$router.push({
              path: "/experiment/list",
            });
          }
        } catch (error) {
          this.$message.error("服务器异常");
        }
      }
    },
    async handleModify() {
      if (this._validator) {
        this.formData.language = this.checkList.join(';')
        let data = this.formData;
        data.needToChange = this.needToChange;
        if (this.needToChange) {
          this.formData.inputSample = this.samples[0].input;
          this.formData.outputSample = this.samples[0].output;
          data.samples = this.samples;
        }
        await modifyExperiment(data);
        this.$router.push({
          path: '/experiment/list'
        })
        this.$message.success("保存成功")
      } else {
        this.$message.error("保存失败")
      }
    },
    _reset() {
      this.formData = {
        displayId: "",
        title: "",
        content: "",
        inputDesc: "",
        outputDesc: "",
        inputSample: "",
        outputSample: "",
        language: "",
        maxCpuTime: 1000,
        maxMemory: 32,
        type: 2,
        template: "",
        difficulty: 1,
        status: 1,
        point: 100,
        hint: "",
      };
      this.checkList = ["C", "C++"];
      this.samples = [{ input: "", output: "" }];
    },
    _validator() {
      let flag = true;
      if (this.formData.content === "" || this.formData.content === null) {
        flag = false;
        this.$message.error("题干描述不能为空");
        return flag;
      } else if (
        this.formData.displayId === "" ||
        this.formData.displayId === null
      ) {
        flag = false;
        this.$message.error("序列号不能为空");
        return flag;
      } else if (this.formData.tittle === "" || this.formData.title === null) {
        flag = false;
        this.$message.error("题目标题不能为空");
        return flag;
      } else if (
        this.formData.inputDesc === "" ||
        this.formData.inputDesc === null
      ) {
        flag = false;
        this.$message.error("输入描述不能为空");
        return flag;
      } else if (
        this.formData.outputDesc === "" ||
        this.formData.outputDesc === null
      ) {
        flag = false;
        this.$message.error("输出描述不能为空");
        return flag;
      } else if (this.checkList.length === 0) {
        flag = false;
        this.$message.error("请选择可使用的编程语言");
        return flag;
      } else if (this.samples.length <= 1) {
        flag = false;
        this.$message.error("测试样例至少2组,小心被暴力打表");
        return flag;
      } else if (
        this.formData.type === 2 &&
        this.formData.template.trim().length === 0
      ) {
        flag = false;
        this.$message.error("模板题的模板可不能为空噢");
        return flag;
      }
      return flag;
    },
  },
  async mounted() {
    let id = this.$route.query.id;
    if (id !== "" && id !== null && id !== undefined) {
      this.isModify = true;
      try {
        let res = await getDetail(id);
        this.formData = res.data.data;
        this.checkList = res.data.checkList;
        this.samples = res.data.samples;
        this.samples.map((item) => {
          this.oldSamples.push({ input: item.input, output: item.output });
        });
      } catch (error) {
        console.log(error);
        this.$message.error("服务器异常");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 10px;
  padding: 30px;
  box-shadow: 0px 0px 12px 1px #aaa;
}

.header {
  color: #3465a2;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.add-sample-btn {
  margin: 10px 0 10px 0;
}

.add-samples {
  width: 100%;
  background-color: #fff;
  border: 1px dashed #aaa;
  outline: none;
  cursor: pointer;
  color: #666;
  height: 35px;
  font-size: 14px;
  &:hover {
    background-color: #f9fafc;
  }
  i {
    margin-right: 10px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
}
</style>