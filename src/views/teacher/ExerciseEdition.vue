<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{ isModify ? "修改理论练习题" : "新增理论练习题" }}</p>
        </div>
      </div>
      <div class="main">
        <el-form
          label-position="top"
          ref="exerciseForm"
          :v-model="exerciseInfo"
        >
          <el-form-item label="题干内容" prop="content">
            <Editor v-model="exerciseInfo.content"></Editor>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="难度:" prop="difficulty">
                <el-select v-model="exerciseInfo.difficulty">
                  <el-option :key="1" label="简单" :value="1"></el-option>
                  <el-option :key="2" label="中等" :value="2"></el-option>
                  <el-option :key="3" label="困难" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="题型" prop="type">
                <el-select v-model="exerciseInfo.type">
                  <el-option :key="1" label="单选题" :value="1"></el-option>
                  <el-option :key="2" label="多选题" :value="2"></el-option>
                  <el-option :key="3" label="判断题" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方向/类别">
                <el-cascader
                  :options="optionData"
                  :key="cascaderKey"
                  v-model="optionValue"
                  class="cascader"
                  clearable
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="optionsPanel">
            <div class="optionHeader">
              <p>{{ optionsHeader }}</p>
              <el-button
                @click="addOption"
                v-if="exerciseInfo.type !== 3"
                icon="el-icon-plus"
                plain
                >增加选项</el-button
              >
            </div>
            <div class="optionBody">
              <div class="singleBox" v-show="exerciseInfo.type !== 3">
                <div
                  class="singleOption"
                  style="margin-bottom: 30px"
                  v-for="index in optionsNum"
                  :key="index"
                >
                  <span>{{ String.fromCharCode(index + 64) }}</span>
                  <el-input
                    :placeholder="'请输入选项' + index + '的内容'"
                    style="width: 90%"
                    v-model="optionsArray[index - 1]"
                  ></el-input>
                  <el-button
                    icon="el-icon-close"
                    plain
                    circle
                    @click="removeOption(index - 1)"
                    type="danger"
                  ></el-button>
                </div>
              </div>
              <div class="judgeBox" v-show="exerciseInfo.type === 3">
                <el-input
                  style="margin-bottom: 30px"
                  placeholder="请输入选项内容"
                  prefix-icon="el-icon-aim"
                  v-model="optionsArray[0]"
                >
                </el-input>
                <el-input
                  placeholder="请输入选项内容"
                  prefix-icon="el-icon-aim"
                  v-model="optionsArray[1]"
                >
                </el-input>
              </div>
            </div>
            <div class="optionFooter">
              <p>选取正确选项</p>
              <el-select
                style="width: 30%"
                v-if="exerciseInfo.type === 1"
                v-model="exerciseInfo.answer"
              >
                <el-option
                  v-for="index in optionsNum"
                  :key="index"
                  :label="String.fromCharCode(index + 64)"
                  :value="index.toString()"
                ></el-option>
              </el-select>
              <el-select
                v-if="exerciseInfo.type === 2"
                v-model="answerArray"
                multiple
                style="width: 30%"
                placeholder="请输入正确选项"
              >
                <el-option
                  v-for="index in optionsNum"
                  :key="index.toString()"
                  :label="String.fromCharCode(index + 64)"
                  :value="index.toString()"
                ></el-option>
              </el-select>
              <el-select
                style="width: 30%"
                v-if="exerciseInfo.type === 3"
                v-model="exerciseInfo.answer"
              >
                <el-option label="选项1" :value="'1'"></el-option>
                <el-option label="选项2" :value="'2'"></el-option>
              </el-select>
            </div>
          </div>
          <el-form-item label="提示" prop="hint">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入提示内容"
              v-model="exerciseInfo.hint"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入备注内容"
              v-model="exerciseInfo.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row
          :gutter="10"
          style="border-top: 1px solid #ccc; padding-top: 30px"
        >
          <el-col :span="20">
            <el-button @click="handleSave" type="success" plain
              >保存并发布</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button type="warning" @click="handleSaveAsDraft" plain
              >存为草稿</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="goBack" plain>放弃编辑</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/Simditor";
import { getTree } from "@/api/System/courseDirection";
import { addOne, getDetail, modify } from "@/api/exercise";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      isModify: false,
      exerciseInfo: {
        id: "",
        type: 1,
        difficulty: 1,
        directionId: "",
        categoryId: "",
        content: "",
        options: "",
        answer: "1",
        hint: "",
        status: "",
        remark: "",
      },
      optionsNum: 4,
      // 用于接收用户编辑的选项信息，后续处理成字符串
      optionsArray: [],
      // 用于接收多选题的答案信息，后续处理成字符串
      answerArray: [],
      cascaderKey: 1,
      optionData: [],
      optionValue: [],
    };
  },
  computed: {
    optionsHeader: function () {
      switch (this.exerciseInfo.type) {
        case 1:
          return "新增单选题选项";
        case 2:
          return "新增多选题选项";
        case 3:
          return "新增判断题选项";
      }
    },
  },
  watch: {
    //饿了么的Cascader有问题，切换数据源
    optionData() {
      ++this.cascaderKey;
    },
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "/exerciseManage/index",
      });
    },
    addOption() {
      this.optionsNum++;
    },
    removeOption(index) {
      this.optionsArray.splice(index, 1);
      this.optionsNum--;
    },
    handleChange(value) {
      this.optionValue = value;
    },
    async handleSave() {
      if (this.optionValue.length === 0 || this.optionValue === null) {
        this.$message({
          type: "warning",
          message: "所属方向/类别内容未选择完整,请补全",
        });
      } else {
        this.exerciseInfo.status = 1;
        this.exerciseInfo.directionId = this.optionValue[0];
        this.exerciseInfo.categoryId = this.optionValue[1];
        if (this.exerciseInfo.type === 2) {
          this.exerciseInfo.answer = this.answerArray.sort().join(";");
        }
        if (
          !this._optionsValidator(this.optionsArray) ||
          this.optionsArray.length === 0
        ) {
          this.$message({
            type: "warning",
            message: "选项内容未填写完整,请补全",
          });
        } else {
          this.exerciseInfo.options = this.optionsArray.join(";");
          if (!this.isModify) {
            try {
              await addOne(this.exerciseInfo);
              this.$message.success("发布成功,快去看看吧");
              this.$router.push({
                path: "/exerciseManage/index",
                query: {
                  filter: 2,
                },
              });
            } catch (error) {
              this.$message.error("服务器异常");
            }
          } else {
            try {
              await modify(this.exerciseInfo);
              this.$message.success("保存成功,快去看看吧");
              this.$router.push({
                path: "/exerciseManage/index",
                query: {
                  filter: 2,
                },
              });
            } catch (error) {
              this.$message.error("服务器异常");
            }
          }
        }
      }
    },
    async handleSaveAsDraft() {
      try {
        this.exerciseInfo.status = 0;
        await modify(this.exerciseInfo);
        this.$message.success("保存成功,快去看看吧");
        this.$router.push({
          path: "/exerciseManage/index",
          query: {
            filter: 3,
          },
        });
      } catch (error) {}
    },
    _optionsValidator(data) {
      let flag = false;
      data.some((item) => {
        if (item === null || item === "") {
          flag = false;
          return true;
        }
      });
      flag = true;
      return flag;
    },
  },
  async created() {
    let id = this.$route.query.id;
    if (parseInt(id) !== 0) {
      // 获取题目信息，该模块为题目编辑模块
      this.isModify = true;
      try {
        let res = await getDetail(id);
        this.exerciseInfo = res.data;
        this.optionValue[0] = res.data.directionId;
        this.optionValue[1] = res.data.categoryId;
        this.optionsArray = res.data.options.split(";");
      } catch (error) {}
    } else {
      this.isModify = false;
    }
    try {
      let res = await getTree();
      this.optionData = res.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
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

.main {
  padding: 10px 30px;
}

.optionsPanel {
  width: 100%;
  padding: 30px 0;
}

.optionHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  padding: 0 30px;
}

.optionBody {
  width: 100%;
  padding: 30px 20px;
  background: #efefef;
}

.singleOption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.optionFooter {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border: 1px solid #eee;
  border-radius: 0 0 5px 5px;
}
</style>