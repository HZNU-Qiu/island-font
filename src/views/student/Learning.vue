<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{ title }}</p>
        </div>
        <div class="header-right">
          <el-button
            @click="handleBack"
            class="btn"
            icon="el-icon-arrow-left"
            plain
            >返回</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="content" v-html="content"></div>
          </el-col>
          <!--  -->
          <el-col :span="8">
            <div class="homework">
              <div v-if="lock && !showResult" class="showHomework">
                <el-button
                  @click="lock = false"
                  style="width: 70%"
                  type="success"
                  icon="el-icon-lock"
                  plain
                  round
                  >点我解锁作业</el-button
                >
                <div class="mask">
                  <p>内容未解锁</p>
                </div>
              </div>
              <div v-if="!lock && !showResult" class="complete">
                <el-button
                  style="width: 70%"
                  type="danger"
                  icon="el-icon-lock"
                  plain
                  round
                  @click="handleSubmit"
                  >提交作业</el-button
                >
              </div>
              <div v-if="showResult" class="gradeBoard">
                <div class="gradeImg">
                  <img v-show="grade === 1" src="@/assets/A.png" alt="" />
                  <img v-show="grade === 2" src="@/assets/B.png" alt="" />
                  <img v-show="grade === 3" src="@/assets/C.png" alt="" />
                  <img v-show="grade === 4" src="@/assets/D.png" alt="" />
                </div>
                <div class="gradeDetail">
                  <p style="color: #00ad00; border-left: 5px solid #00ad00">
                    正确: {{ rightNum }}
                  </p>
                  <p style="color: #d10000; border-left: 5px solid #d10000">
                    错误: {{ wrongNum }}
                  </p>
                </div>
              </div>
              <div class="homeworkEx">
                <student-exercise-card
                  v-show="!lock || showResult"
                  v-for="(sample, index) in homeworks"
                  :key="index"
                  :exercise="sample"
                  :showResult="showResult"
                ></student-exercise-card>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getContent } from "@/api/Teacher/course";
import { listHomework } from "@/api/homework.js";
import {
  submitAndSave,
  getStudentHomeworkRecord,
} from "@/api/Student/studentHomework.js";
import { hasComplete } from "@/api/Student/studentChapter.js";
import StudentExerciseCard from "@/components/StudentExerciseCard/index.vue";
export default {
  components: {
    StudentExerciseCard,
  },
  data() {
    return {
      id: -1,
      courseId: -1,
      title: "",
      content: "",
      homeworks: [],
      lock: true,
      showResult: false,
      grade: 0,
      rightNum: 0,
      wrongNum: 0,
    };
  },
  methods: {
    handleBack() {
      this.$router.back(-1);
    },
    async handleSubmit() {
      let results = [];
      this.homeworks.map((item) => {
        let x = {};
        x.homeworkId = item.homeworkId;
        x.result = item.result;
        x.studentAnswer = item.studentAnswer;
        results.push(x);
      });
      // 存结果 + 完成章节学习 + 获得成绩
      let data = {};
      data.results = results;
      data.courseId = this.courseId;
      data.chapterId = this.id;
      let res = await submitAndSave(data);
      this.grade = res.data.grade;
      this.rightNum = res.data.rightNum;
      this.wrongNum = res.data.wrongNum;
      this.showResult = true;
      this.$message.success("提交成功");
    },
  },
  async created() {
    this.id = this.$route.query.id;
    this.title = this.$route.query.title;
    this.courseId = this.$route.query.courseId;
    let res = await Promise.all([
      getContent(this.id),
      listHomework(this.id),
      hasComplete(this.id),
    ]);
    this.content = res[0].data.content;
    let homeworks = res[1].data;
    homeworks.map((x) => {
      if (x.type === 2) {
        x.multiArray = [];
        x.rightArray = [];
        for (let i = 0; i < x.options.length; i++) {
          x.multiArray[i] = 0;
          x.rightArray[i] = 0;
        }
        let arr = [];
        arr = x.answer.split(";");
        arr.map((i) => {
          x.rightArray[parseInt(i - 1)] = 1;
        });
      }
      x.current = 0;
      x.studentAnswer = "";
      x.result = 0;
    });
    if (res[2].data !== null) {
      this.grade = res[2].data.grade;
      this.showResult = true;
      let r = await getStudentHomeworkRecord(this.id);
      let studentsRecord = r.data;
      homeworks.map((x) => {
        studentsRecord.map((y) => {
          if (x.homeworkId === y.homework_id) {
            x.current = parseInt(y.student_answer);
            x.studentAnswer = y.student_answer;
            if (x.type === 2) {
              for (let i = 0; i < x.options.length; i++) {
                x.multiArray[i] = 0;
              }
              let arr = [];
              arr = x.studentAnswer.split(";");
              arr.map((i) => {
                x.multiArray[parseInt(i - 1)] = 1;
              });
            }
            x.result = y.result;
            if (y.result === 0) {
              this.wrongNum++;
            } else {
              this.rightNum++;
            }
          }
        });
      });
      console.log(homeworks);
      this.homeworks = homeworks;
    } else {
      this.homeworks = homeworks;
    }
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

.main {
  background: #fdfdfd;
  display: flex;
  justify-content: center;
}

.content {
  padding-left: 20px;
  border-left: 6px solid #3465a2;
}

.homework {
  min-height: 600px;
  background-color: #fff;
  border-left: 3px dashed #aaa;
}

.showHomework {
  margin-top: 30px;
  min-height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mask {
  height: 1000px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask > p {
  color: #3465a9;
  font: 16px;
}

.complete {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gradeBoard {
  padding: 0 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.gradeDetail > p {
  font-size: 20px;
  margin-right: 30px;
  padding-left: 5px;
  border-left: 5px solid #00ad00;
}
</style>