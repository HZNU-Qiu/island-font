<template>
  <div>
    <div class="panel">
      <el-row :gutter="20">
        <el-col class="header" :span="18">
          <span>{{ startTime }} -- {{ endTime }}</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="timePercent"
          ></el-progress>
        </el-col>
        <el-col :span="3"><br /></el-col>
        <el-col class="header" :span="3">
          <el-button
            @click="handleSubmit"
            type="success"
            icon="el-icon-check"
            plain
            >完成提交</el-button
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!--  -->
      <div class="main">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="problem">
              <p>第{{ current + 1 }}题 ({{ problems[current].point }}分)</p>
              <div v-html="problems[current].content" class="content"></div>
              <div v-if="problems[current].type === 1" class="options">
                <div
                  class="item"
                  v-for="(x, i) in problems[current].options"
                  :key="i"
                >
                  <span
                    @click="handleSelect(i + 1)"
                    :class="[
                      'chooser',
                      {
                        isActive:
                          parseInt(problems[current].studentAnswer) ===
                          parseInt(i + 1),
                      },
                    ]"
                    >{{ String.fromCharCode(i + 65) }}</span
                  >
                  {{ x }}
                </div>
              </div>
              <!-- 多选 -->
              <div v-if="problems[current].type === 2" class="options">
                <div
                  class="item"
                  v-for="(x, i) in problems[current].options"
                  :key="i"
                >
                  <span
                    @click="handleMultiSelect(i)"
                    style="border-radius: 8px"
                    :class="[
                      'chooser',
                      { isActive: problems[current].multiArray[i] },
                    ]"
                    >{{ String.fromCharCode(i + 65) }}</span
                  >
                  {{ x }}
                </div>
              </div>
              <!--  -->
              <div v-if="problems[current].type === 3" class="options">
                <div class="item">
                  <span
                    @click="handleSelect(1)"
                    :class="[
                      'chooser',
                      { isActive: problems[current].studentAnswer === 1 },
                    ]"
                    >T</span
                  >
                </div>
                <div class="item">
                  <span
                    @click="handleSelect(2)"
                    :class="[
                      'chooser',
                      { isActive: problems[current].studentAnswer === 2 },
                    ]"
                    >F</span
                  >
                </div>
              </div>
              <el-button
                @click="handleSave"
                style="margin-top: 60px"
                type="success"
                icon="el-icon-finished"
                >保存答案</el-button
              >
            </div>
          </el-col>
          <el-col
            style="padding-top: 30px; height: 900px; background-color: #f1f1f1"
            :span="6"
          >
            <div class="indexBox">
              <div
                class="index"
                @click="current = i - 1"
                :class="[
                  { isActive: current === i - 1 },
                  { saved: hasSaved[i - 1] === 1 },
                ]"
                v-for="i in total"
                :key="i"
              >
                {{ i }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getPaperExercises } from "@/api/paper.js";
import { saveRecord, judgeExam } from "@/api/Student/examRecord.js";
import { getExamDuration } from "@/api/Student/studentExams.js";
export default {
  data() {
    return {
      examId: 0,
      paperId: 0,
      timePercent: 0,
      problems: [],
      current: 0,
      total: 0,
      startTime: "",
      endTime: "",
      hasSaved: [],
    };
  },
  computed: {
    problemPoint: function () {
      return this.problems[this.current].point;
    },
    // leftTimestamp: function() {
    //   this.getTimePercent();
    // }
  },
  methods: {
    handleSelect(x) {
      let obj = this.problems[this.current];
      obj.studentAnswer = x;
      this.$set(this.problems, this.current, obj);
    },
    handleMultiSelect(x) {
      let obj = this.problems[this.current];
      obj.multiArray[x] = obj.multiArray[x] === 0 ? 1 : 0;
      let str = "",
        arr = [];
      obj.multiArray.map((x, i) => {
        if (x !== 0) {
          arr.push(i + 1);
        }
      });
      str = arr.join(";");
      obj.studentAnswer = str;
      console.log(obj);
      this.$set(this.problems, this.current, obj);
    },
    async handleSave() {
      let saveProblem = this.problems[this.current];
      let saveData = {};
      saveData.exerciseId = saveProblem.exerciseId;
      saveData.examId = parseInt(this.examId);
      saveData.studentAnswer = saveProblem.studentAnswer;
      this.hasSaved[this.current] = 1;
      try {
        await saveRecord(saveData);
        this.$message.success("答案已保存,请放心继续作答");
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    async handleSubmit() {
      let flag = false;
      flag = this.hasSaved.some((item) => {
        if (parseInt(item) !== 1) {
          return true;
        }
      });
      if (flag) {
        this.$message.error("还有题目遗漏,请仔细检查");
      } else {
        let data = {};
        data.examId = this.examId;
        data.paperId = this.paperId;
        await judgeExam(data);
        this.$router.push({
          path: "/Exam/myGrades",
        });
      }
    },
    getTimePercent() {
      let startTimestamp = new Date(this.startTime);
      let endTimestamp = new Date(this.endTime);
      let totalDuration = endTimestamp - startTimestamp;
      let currentTimestamp = new Date().getTime();
      let leftTimestamp = currentTimestamp - startTimestamp;
      let timePercent = ((leftTimestamp / totalDuration) * 100).toFixed(1);
      if (timePercent <= 100) {
        this.timePercent = parseFloat(timePercent);
        setTimeout(this.getTimePercent, 1000);
      }
    },
  },
  async created() {
    try {
      this.examId = this.$route.query.examId;
      this.paperId = this.$route.query.paperId;
      let res = await Promise.all([
        getPaperExercises(this.paperId),
        getExamDuration(this.examId),
      ]);
      this.problems = res[0].data;
      this.total = this.problems.length;
      for (let i = 0; i < this.total; i++) {
        this.hasSaved[i] = 0;
      }
      this.problems.map((item) => {
        item.options = item.options.split(";");
        if (item.type === 2) {
          item.multiArray = [];
          for (let i = 0; i < item.options.length; i++) {
            item.multiArray[i] = 0;
          }
        }
      });
      this.startTime = res[1].data.startTime;
      this.endTime = res[1].data.endTime;
      this.timePercent = parseFloat(res[1].data.timePercent);
      this.getTimePercent();
    } catch (error) {}
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
  padding: 30px 0 20px 0;
}

.el-divider--horizontal {
  margin: 0;
}

.problem {
  width: 90%;
  padding: 50px;
}

.indexBox {
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.index {
  border: 2px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 1px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
  color: rgb(61, 61, 61);
  background-color: rgba(255, 255, 255, 0.5);
}

.options > .item {
  margin: 10px 0;
  border: none;
}

.chooser {
  border: 1px solid #3465a2;
  border-radius: 50%;
  color: #3465a2;
  padding: 1px 7px;
  cursor: pointer;
}

.isActive {
  background-color: #3465a2;
  color: #ffe;
}

.saved {
  background-color: #0a9e2f;
  color: #ffe;
}
</style>