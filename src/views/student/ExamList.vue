<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>课程考核</p>
        </div>
        <div class="header-right">
          <el-button icon="el-icon-s-order" plain type="primary"
            >我的成绩单</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <div class="courseCard" v-for="(sample, index) in exams" :key="index">
          <div
            class="card-header"
            v-bind:style="{ background: boxColor[sample.id % 5] }"
          >
            <h1>{{ sample.name }}</h1>
          </div>
          <div class="card-body">
            <p>{{ sample.name }}</p>
          </div>
          <div class="card-footer">
            <div>
              <p style="font-size: 12px">起始: {{ sample.startTime }}</p>
              <p style="font-size: 12px">结束: {{ sample.endTime }}</p>
            </div>
            <el-button
              v-show="sample.status === 1 && sample.hasJoined === false"
              style="height: 40px; margin-top: 5px"
              size="mini"
              icon="el-icon-tickets"
              plain
              @click="doExam(sample.id, sample.paperId)"
              type="primary"
              >开始考试</el-button
            >
            <el-tag v-if="sample.status === 0" type="warning" effect="dark">
              未开始
            </el-tag>
            <el-tag v-if="sample.status === 2" type="danger" effect="dark">
              已结束
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listStudentExams } from "@/api/Student/studentExams.js";
export default {
  data() {
    return {
      boxColor: [
        "linear-gradient(to right, #fb7299, #ff5c7c)",
        "linear-gradient(to right, #fb72e9, #ff5ce9)",
        "linear-gradient(to right, #bd72fb, #b05cff)",
        "linear-gradient(to right, #8672fb, #675cff)",
        "linear-gradient(to right, #51c464, #45ad3c)",
      ],
      exams: [],
    };
  },
  methods: {
    async doExam(examId, paperId) {
      this.$router.push({
        path: "/doExam",
        query: {
            examId,
            paperId
        }
      });
    },
  },
  async created() {
    try {
      let res = await listStudentExams();
      this.exams = res.data;
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

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 30px;
}

.courseCard {
  width: 300px;
  height: 280px;
  box-shadow: 2px 2px 12px 5px rgba(12, 35, 138, 0.1);
  border-radius: 5px;
  margin: 30px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  border-radius: 5px 5px 0 0;
}

.card-body {
  height: 10%;
  padding-left: 10px;
  font-size: 16px;
}

.card-footer {
  padding: 0 10px;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>