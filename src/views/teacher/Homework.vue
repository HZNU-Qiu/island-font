<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{ chapterName }} · 作业布置</p>
        </div>
        <div class="header-right">
          <el-button @click="goBack" icon="el-icon-arrow-left" plain
            >返回</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <el-row :gutter="10">
          <el-col :span="9">
            <div class="previewer">
              <div class="pre-header">
                <p style="color: #3465a2; font-size: 26px; margin-left: 10px">
                  题目一览
                </p>
                <el-button
                  @click="saveHomework"
                  plain
                  icon="el-icon-check"
                  type="success"
                  style="height: 40px"
                  >保存并发布</el-button
                >
              </div>
              <el-divider content-position="right"
                ><span>共{{ homeworkTotal }}题</span></el-divider
              >
              <el-collapse>
                <el-collapse-item
                  v-for="(sample, index) in homework"
                  :key="index"
                  :title="'第' + (index + 1) + '题'"
                >
                  <div v-html="sample.content" class="content"></div>
                  <div class="options">
                    <div class="item" v-for="(x, i) in sample.options" :key="i">
                      <span class="chooser">{{
                        String.fromCharCode(i + 65)
                      }}</span>
                      {{ x }}
                    </div>
                  </div>
                  <p style="color: #607d8b" class="answer">
                    {{
                      "正确答案: " +
                      String.fromCharCode(parseInt(sample.answer) + 64)
                    }}
                  </p>
                  <p style="color: #607d8b" class="hint">
                    {{ "提示: " + (sample.hint ? sample.hint : "无") }}
                  </p>
                  <p style="color: #607d8b" class="remark">
                    {{ "解析: " + sample.remark }}
                  </p>
                  <el-button
                    @click="removeHomework(index)"
                    style="margin-left: 80%"
                    icon="el-icon-close"
                    type="danger"
                    plain
                    >移除</el-button
                  >
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="exercises">
              <div class="ex-header">
                <div class="ex-type">
                  <p style="color: #3465a2; font-size: 18px; font-weight: bold">
                    题目类型:
                  </p>
                  <ul class="filter">
                    <li
                      class="item"
                      @click="exType = 0"
                      :class="{ on: exType === 0 }"
                    >
                      全部
                    </li>
                    <li
                      class="item"
                      @click="exType = 1"
                      :class="{ on: exType === 1 }"
                    >
                      单选题
                    </li>
                    <li
                      class="item"
                      @click="exType = 2"
                      :class="{ on: exType === 2 }"
                    >
                      多选题
                    </li>
                    <li
                      class="item"
                      @click="exType = 3"
                      :class="{ on: exType === 3 }"
                    >
                      判断题
                    </li>
                  </ul>
                </div>
                <div class="ex-difficulty">
                  <p style="color: #3465a2; font-size: 18px; font-weight: bold">
                    题目难度:
                  </p>
                  <ul class="filter">
                    <li
                      class="item"
                      @click="exDiff = 0"
                      :class="{ on: exDiff === 0 }"
                    >
                      全部
                    </li>
                    <li
                      class="item"
                      @click="exDiff = 1"
                      :class="{ on: exDiff === 1 }"
                    >
                      简单
                    </li>
                    <li
                      class="item"
                      @click="exDiff = 2"
                      :class="{ on: exDiff === 2 }"
                    >
                      中等
                    </li>
                    <li
                      class="item"
                      @click="exDiff = 3"
                      :class="{ on: exDiff === 3 }"
                    >
                      困难
                    </li>
                  </ul>
                </div>
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :total="total"
                  :page-size="20"
                  @current-change="currentPageChanged"
                >
                </el-pagination>
              </div>
              <div class="ex-body">
                <div v-show="exercises.length === 0" class="noneBox">
                  还没有相关题目哦,赶紧去添加吧
                </div>
                <div
                  class="exercise"
                  v-for="(sample, index) in exercises"
                  :key="index"
                >
                  <div v-html="sample.content" class="content"></div>
                  <div class="options">
                    <div class="item" v-for="(x, i) in sample.options" :key="i">
                      <span class="chooser">{{
                        String.fromCharCode(i + 65)
                      }}</span>
                      {{ x }}
                    </div>
                  </div>
                  <p style="color: #607d8b" class="answer">
                    {{ "正确答案: " + sample.answer }}
                  </p>
                  <p style="color: #607d8b" class="hint">
                    {{ "提示: " + (sample.hint ? sample.hint : "无") }}
                  </p>
                  <p style="color: #607d8b" class="remark">
                    {{ "解析: " + sample.remark }}
                  </p>
                  <el-button
                    @click="pushToPreview(sample)"
                    plain
                    type="primary"
                    icon="el-icon-plus"
                    >添加至作业</el-button
                  >
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { listExercises, listHomework, saveHomework } from "@/api/homework.js";
import { filterExercise } from "@/api/exercise.js";
export default {
  data() {
    return {
      chapterName: "",
      id: 0,
      exDiff: 0,
      exType: 0,
      total: 0,
      exercises: [],
      homework: [],
      current: 1,
    };
  },
  computed: {
    homeworkTotal: function () {
      if (this.homework.length === 0) {
        return 0;
      } else {
        return this.homework.length;
      }
    },
  },
  watch: {
    exType: function () {
      this.handleFilter();
    },
    exDiff: function () {
      this.handleFilter();
    },
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    // 加入作业预览
    pushToPreview(data) {
      let flag = 1;
      this.homework.some((item) => {
        if (item.id === data.id) {
          flag = 0;
          return true;
        }
      });
      if (flag) this.homework.push(data);
      else this.$message.error("已添加改题目了");
    },
    // 移除作业
    removeHomework(index) {
      this.homework.splice(index, 1);
    },
    // 保存发布作业
    async saveHomework() {
      let data = [];
      let chapterId = this.id;
      this.homework.map((item) => {
        let x = {};
        x.exerciseId = item.id;
        x.chapterId = this.id;
        data.push(x);
      });
      try {
        await saveHomework({ data, chapterId });
        this.$message.success("保存成功");
      } catch (error) {
        this.$message.error("服务异常");
        console.log(error);
      }
    },
    async handleFilter() {
      try {
        let query = {};
        query.difficulty = this.exDiff;
        query.type = this.exType;
        query.current = this.current;
        query.chapterId = this.id;
        let res = await filterExercise(query);
        this.exercises = res.data;
        this.total = res.data[0].total;
        this.exercises.map((item) => {
          item.options = item.options.split(";");
          if (item.type === 2) {
            let arr = [];
            arr = item.answer.split(";");
            let str = "";
            arr.map((x) => {
              str += String.fromCharCode(parseInt(x) + 64);
            });
            item.answer = str;
          } else {
            item.answer = String.fromCharCode(parseInt(item.answer) + 64);
          }
        });
      } catch (error) {}
    },
    async currentPageChanged(val) {
      let query = {};
      query.difficulty = this.exDiff;
      query.type = this.exType;
      this.current = val;
      query.current = this.current;
      query.chapterId = this.id;
      let res = await filterExercise(query);
      this.exercises = res.data;
      this.total = res.data[0].total;
      this.exercises.map((item) => {
        item.options = item.options.split(";");
      });
    },
  },
  async created() {
    this.chapterName = this.$route.query.title;
    this.id = parseInt(this.$route.query.id);
    try {
      let res = await Promise.all([
        listExercises(1, this.id),
        listHomework(this.id),
      ]);
      this.exercises = res[0].data.rows;
      this.exercises.map((item) => {
        item.options = item.options.split(";");
        if (item.type === 2) {
          let arr = [];
          arr = item.answer.split(";");
          let str = "";
          arr.map((x) => {
            str += String.fromCharCode(parseInt(x) + 64);
          });
          item.answer = str;
        } else {
          item.answer = String.fromCharCode(parseInt(item.answer) + 64);
        }
      });
      this.total = res[0].data.count;
      this.homework = res[1].data;
    } catch (error) {
      this.$message.error("服务异常");
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

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  margin-top: 20px;
}

.previewer {
  min-height: 300px;
}

.pre-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.exercises {
  min-height: 700px;
  border-left: 2px dashed #aaa;
}

.noneBox {
  width: 90%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #aaa;
}

.ex-header {
  display: flex;
  flex-direction: column;
  background: #eee;
  padding: 10px 20px;
  border-top: 1px solid #ccc;
}

.ex-type,
.ex-difficulty {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
}

.item {
  list-style: none;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  padding: 8px;
  margin: 0 6px;
  cursor: pointer;
}

.on {
  color: #3465a2;
  background: rgba(12, 35, 138, 0.05);
  border-radius: 4px;
}

.ex-body {
  margin-top: 20px;
}

.exercise {
  padding: 20px;
  margin: 20px 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 12px 5px rgba(12, 35, 138, 0.1);
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
}
</style>