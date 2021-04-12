<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{ details.name }}</p>
        </div>
        <div class="header-right">
          <el-button @click="goBack" icon="el-icon-arrow-left" plain
            >返回</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-card class="static" shadow="always">
              <p>
                <span class="cardLabel">简介：</span>
                {{ details.description }}
              </p>
            </el-card>
            <!--  -->
            <student-chapter-card
              v-for="(sample, index) in chapters"
              :key="index"
              :selfId="sample.id"
              :chapterName="sample.name"
              :remark="sample.remark"
              :courseId="details.id"
              :parentId="sample.id"
              :children="sample.children"
              :chapterIndex="index + 1"
              :hasStudied="hasStudied"
              :hasDone="sample.hasDone"
            ></student-chapter-card>
          </el-col>
          <el-col :span="7">
            <!--  -->
            <el-card
              style="margin-top: 20px; display: flex; justify-content: center"
              shadow="hover"
            >
              <el-button
                @click="handleStartLearning"
                v-if="!hasStudied"
                style="width: 250px; height: 40px"
                type="danger"
                round
                >开始学习</el-button
              >
              <div v-else class="progressBoard">
                <el-progress
                  type="dashboard"
                  :percentage="parseInt(studentProgress)"
                  :color="colors"
                ></el-progress>
                <div class="extra">
                  <p style="font-weight: 800; font-size: 16px">当前的学习进度</p>
                  <p style="color: #f56c6c">获A次数:  {{ATotal}}</p>
                  <p style="color: #e6a23c">获B次数:  {{BTotal}}</p>
                  <p style="color: #5cb87a">获C次数:  {{CTotal}}</p>
                  <p style="color: #1989fa">获D次数:  {{DTotal}}</p>
                </div>
              </div>
            </el-card>
            <!--  -->
            <el-card class="static" shadow="hover">
              <span class="cardLabel">课程须知：</span>
              <div style="white-space: pre-wrap">{{ details.notice }}</div>
            </el-card>
            <!--  -->
            <el-card class="static" shadow="hover">
              <span class="cardLabel">课程目标：</span>
              <div style="white-space: pre-wrap">{{ details.objectives }}</div>
            </el-card>
            <el-card style="margin-top: 20px" shadow="hover">
              <div class="cardHeader">
                <i class="el-icon-info"></i>
                <span>任课教师</span>
              </div>
              <div class="cardBody">
                <div class="cardItem">
                  <div>姓名</div>
                  <div>{{ details.realname }}</div>
                </div>
                <div class="cardItem">
                  <div>性别</div>
                  <div>{{ details.sex === 1 ? "男" : "女" }}</div>
                </div>
                <div class="cardItem">
                  <div>邮箱</div>
                  <div>{{ details.email }}</div>
                </div>
              </div>
            </el-card>
            <!--  -->
            <el-card style="margin-top: 20px" shadow="hover">
              <div class="cardHeader">
                <i class="el-icon-question"></i>
                <span>课程信息</span>
              </div>
              <div class="cardBody">
                <div class="cardItem">
                  <div>难度</div>
                  <div>{{ difficultyLabel }}</div>
                </div>
                <div class="cardItem">
                  <div>方向</div>
                  <div>{{ details.directionName }}</div>
                </div>
                <div class="cardItem">
                  <div>类别</div>
                  <div>{{ details.categoryName }}</div>
                </div>
                <div class="cardItem">
                  <div>评分</div>
                  <div>
                    {{ details.point === 0 ? "暂无评分" : details.point }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail } from "@/api/Teacher/courseManage";
import { getAll } from "@/api/Teacher/chapterManage";
import { getProgress } from "@/api/Student/studentChapter";
import { startLearning, hasStart } from "@/api/Student/studentCourse";
import StudentChapterCard from "./components/StudentChapterCard.vue";
export default {
  components: {
    StudentChapterCard,
  },
  data() {
    return {
      details: {
        id: -1,
        name: "",
        description: "",
        difficulty: 1,
        point: 0,
        notice: "",
        objectives: "",
        creatorName: "",
        directionName: "",
        categoryName: "",
      },
      hasStudied: false,
      chapters: [],
      studentProgress: 0,
      colors: [
        { color: "#f56c6c", studentProgress: 20 },
        { color: "#e6a23c", studentProgress: 40 },
        { color: "#5cb87a", studentProgress: 60 },
        { color: "#1989fa", studentProgress: 80 },
        { color: "#6f7ad3", studentProgress: 100 },
      ],
      ATotal: 0,
      BTotal: 0,
      CTotal: 0,
      DTotal: 0,
      chaptersTotal: 0,
      hasStudiedChapters: {
        total: 0,
        rows: [],
      },
    };
  },
  computed: {
    difficultyLabel: function () {
      switch (this.details.difficulty) {
        case 1:
          return "入门";
        case 2:
          return "中级";
        case 3:
          return "高级";
      }
    },
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    async handleStartLearning() {
      try {
        await startLearning(this.id);
        this.$message.success("既然开始了，就要坚持学完哦")
      } catch (error) {
        console.log(error)
      }
      this.hasStudied = true;
    },
  },
  async created() {
    // 获取课程信息(包括教师信息) + 获取章节信息(包括学生学习进度)
    let courseId = this.$route.query.id;
    this.id = courseId;
    let res = await Promise.all([
      getDetail(courseId),
      getAll(courseId),
      hasStart(courseId),
      getProgress(courseId),
    ]);
    this.details = res[0].data;
    let chapters = res[1].data;
    this.hasStudied = res[2].data.data;
    let progress = res[3].data;
    this.ATotal = progress.ATotal;
    this.BTotal = progress.BTotal;
    this.CTotal = progress.CTotal;
    this.DTotal = progress.DTotal;
    this.chaptersTotal = progress.chaptersTotal;
    this.hasStudiedChapters = progress.hasStudied;
    this.studentProgress = (this.hasStudiedChapters.count / this.chaptersTotal) * 100;
    this.hasStudiedChapters.rows.map((item) => {
      chapters.map((x) => {
        x.children.map((y) => {
          if (y.id === item.chapterId) {
            y.hasDone = true;
          }
        });
      });
    });
    this.chapters = chapters;
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

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cardLabel {
  font-size: 18px;
  font-weight: 500;
  color: #3465a2;
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

.static {
  word-break: break-all;
  margin-top: 20px;
}

.progressBoard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.extra {
  margin-left: 30px;
}

.extra > p {
  color: #3465a2;
  font-size: 14px;
  padding: 0;
  margin: 0;
}
</style>