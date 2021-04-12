<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col
        style="dispaly: flex; flex-direction: column; justify-content: center"
        :span="18"
      >
        <Problem :p="problem"></Problem>

        <div class="editorBox">
          <CodeMirror
            :value.sync="code"
            :languages="accessLang"
            @resetCode="onResetCode"
            @changeLang="onLangChange"
          ></CodeMirror>
          <el-button
            type="primary"
            @click="submit()"
            style="width: 150px; height: 50px"
            plain
            >Submit</el-button
          >
          <el-tag v-if="problem_status === -2" class="result_tag" type="info"
            ><i class="el-icon-coffee-cup"></i>Waiting to submit</el-tag
          >
          <el-tag
            v-else-if="problem_status === -4"
            class="result_tag"
            type="warning"
            ><i class="el-icon-loading"></i>Pending! Good luck!</el-tag
          >
          <el-tag
            v-else-if="problem_status === 0"
            class="result_tag"
            type="success"
            ><i class="el-icon-circle-check"></i>Your code has been
            accepted!Yeah~</el-tag
          >
          <el-tag
            v-else-if="problem_status === -3"
            class="result_tag"
            type="warning"
            ><i class="el-icon-circle-close"></i>Seriously?
            {{ tag_text }}</el-tag
          >
          <el-tag v-else class="result_tag" type="danger"
            ><i class="el-icon-circle-close"></i>{{ this.tag_text }}.Just try
            again:)</el-tag
          >
        </div>
      </el-col>
      <el-col :span="6">
        <el-card
          style="margin: 10px 0; cursor: pointer"
          shadow="hover"
        >
          <i class="el-icon-more"
            ><span @click.prevent.stop="toSubmitQueue" style="margin-left: 20px">提交队列</span></i
          >
        </el-card>
        <el-card style="margin-top: 20px" shadow="hover">
          <div class="cardHeader">
            <i class="el-icon-info"></i>
            <span>题目信息</span>
          </div>
          <div class="cardBody">
            <div class="cardItem">
              <div>ID</div>
              <div>{{ displayId }}</div>
            </div>
            <div class="cardItem">
              <div>名称</div>
              <div>{{ title }}</div>
            </div>
            <div class="cardItem">
              <div>时间限制</div>
              <div>{{ maxCpuTime + "MS" }}</div>
            </div>
            <div class="cardItem">
              <div>内存限制</div>
              <div>{{ maxMemory + "MB" }}</div>
            </div>
            <div class="cardItem">
              <div>难度</div>
              <div>{{ difficultyLabel }}</div>
            </div>
            <div class="cardItem">
              <div>分值</div>
              <div>{{ point }}</div>
            </div>
          </div>
        </el-card>
        <!--  -->
        <el-card
          style="margin-top: 30px"
          v-show="compileSuccess === 1"
          shadow="hover"
        >
          <div class="cardHeader">
            <i class="el-icon-info"></i>
            <span>提交详情</span>
          </div>
          <div class="cardBody">
            <div class="cardItem">
              <div>代码大小</div>
              <div>{{ resultFeedback.codeLength }} Byte</div>
            </div>
            <div class="cardItem">
              <div>平均用时</div>
              <div>{{ resultFeedback.avgTime }} MS</div>
            </div>
            <div class="cardItem">
              <div>内存占用</div>
              <div>{{ resultFeedback.avgMemory / 1024 }} KB</div>
            </div>
            <div class="cardItem">
              <div>提交总数</div>
              <div>{{ resultFeedback.submitedNum }}</div>
            </div>
            <div class="pieChart">
              <PieChart
                :chartData="chartData"
                :options="chartOptions"
              ></PieChart>
            </div>
          </div>
        </el-card>
        <!--  -->
        <el-card
          style="margin-top: 30px"
          v-show="compileSuccess === -1"
          shadow="hover"
        >
          <div class="cardHeader">
            <i class="el-icon-info"></i>
            <span>错误详情</span>
          </div>
          <div class="cardBody">
            <div class="reason">
              <h3>Error</h3>
              <div>{{ failedReason }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from "@/components/Charts/ExperimentFeedBackChart/index.js";
import CodeEditor from "@/components/CodeEditor";
import CodeMirror from "@/components/CodeMirror";
import Problem from "@/components/Problem";
import { getDetail, judge } from "@/api/experiments";

export default {
  name: "Program",
  components: {
    CodeEditor,
    Problem,
    CodeMirror,
    PieChart,
  },
  data() {
    return {
      id: 0,
      title: "",
      displayId: 0,
      code: "",
      lang: "cpp",
      accessLang: [],
      problem: {
        inputDesc: "",
        outputDesc: "",
        content: "",
        inputSample: "",
        outputSample: "",
        hint: "",
      },
      maxCpuTime: 1000,
      maxMemory: 32,
      difficulty: 1,
      point: 100,
      ac_rate: 0,
      problem_status: -2,
      tag_type: "info",
      tag_text: "Waiting to submit",
      resultFeedback: {
        codeLength: 0,
        avgTime: 0,
        avgMemory: 0,
        submitedNum: 0,
      },
      compileSuccess: 0,
      failedReason: "",
      chartData: null,
      chartOptions: {
        hoverBorderWidth: 20,
        responsive: true,
      },
    };
  },
  computed: {
    difficultyLabel: function () {
      switch (this.difficulty) {
        case 1:
          return "简单";
        case 2:
          return "中等";
        case 3:
          return "困难";
      }
    },
  },
  methods: {
    async submit() {
      this.problem_status = -4;
      let data = {};
      data.lang = this.lang;
      data.code = this.code;
      data.experimentId = this.id;
      data.displayId = this.displayId;
      data.max_cpu_time = this.maxCpuTime;
      data.max_memory = this.maxMemory;
      data.codeSize = this.code.length;
      data.point = this.point;
      let res = await judge(data);
      let feedBack = res.data;
      if (feedBack.flag === -1) {
        this.problem_status = -3;
        this.tag_text = feedBack.msg;
        this.failedReason = feedBack.reason;
        this.compileSuccess = -1;
      } else {
        this.problem_status = feedBack.result;
        this.tag_text = feedBack.msg;
        this.resultFeedback.codeLength = this.code.length;
        this.resultFeedback.avgTime = feedBack.avgTime;
        this.resultFeedback.avgMemory = feedBack.avgMemory;
        this.resultFeedback.submitedNum = feedBack.submitedNum;
        this.chartData = feedBack.chartData;
        this.compileSuccess = 1;
      }
    },
    toSubmitQueue() {
      this.$router.push({
        path: "/experiment/submited",
        query: {
          id: this.id,
        },
      });
    },
    onResetCode() {
      this.code = "";
    },
    onLangChange(lang) {
      this.lang = lang;
    },
  },
  async created() {
    this.id = this.$route.query.id;
    let res = await getDetail(this.id);
    let data = res.data.data;
    this.title = data.title;
    this.problem.inputDesc = data.inputDesc;
    this.problem.outputDesc = data.outputDesc;
    this.problem.content = data.content;
    this.problem.inputSample = data.inputSample;
    this.problem.outputSample = data.outputSample;
    this.problem.hint = data.hint;
    this.maxCpuTime = data.maxCpuTime;
    this.maxMemory = data.maxMemory;
    this.point = data.point;
    this.displayId = data.displayId;
    this.difficulty = data.difficulty;
    let langs = [];
    langs = res.data.checkList;
    langs.map((item) => {
      let x = { name: "", value: "" };
      switch (item) {
        case "C":
          x.name = "C";
          x.value = "c";
          this.accessLang.push(x);
          break;
        case "C++":
          x.name = "C++";
          x.value = "cpp";
          this.accessLang.push(x);
          break;
        case "Java":
          x.name = "Java";
          x.value = "java";
          this.accessLang.push(x);
          break;
        case "Python3":
          x.name = "Python3";
          x.value = "py3";
          this.accessLang.push(x);
          break;
      }
    });
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.result_tag {
  float: right;
  width: 70%;
  height: 50px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.editorBox {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
}

.cardHeader {
  font-size: 18px;
  font-weight: 500;
  color: #3465a2;
}

.cardItem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 2px dotted #dcdfe6;
  color: #214066;
}

.reason {
  padding: 20px 0;
}

.reason > div {
  color: #aaa;
  word-break: break-all;
}
</style>
