<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{details.name}}</p>
        </div>
        <div class="header-right">
          <el-button @click="goBack" icon="el-icon-arrow-left" plain>返回</el-button>
        </div>
      </div>
      <div class="main">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-card class="static" shadow="always">
              <p>
                <span class="cardLabel">简介：</span>
                {{ details.description }}
              </p>
            </el-card>

            <ChapterAdditionCard
              v-for="(sample, index) in chapters"
              :key="index"
              :selfId="sample.id"
              :chapterName="sample.name"
              :remark="sample.remark"
              :courseId="details.id"
              :parentId="sample.id"
              :children="sample.children"
              :chapterIndex="(index + 1)"
            ></ChapterAdditionCard>

            <div class="addChapterParentNode" @click="dialogVisable = true">
              <i class="el-icon-plus">添加一个章节</i>
            </div>
          </el-col>
          <!--  -->
          <el-col :span="7">
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
                  <div>{{ difficultys[details.difficulty - 1] }}</div>
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
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="新增课程章节" :visible.sync="dialogVisable">
      <el-form :model="chapterForm" ref="chapterForm" :rules="rules">
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="chapterForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="remark">
          <el-input v-model="chapterForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节序号">
          <el-input-number
            v-model="chapterForm.rank"
            controls-position="right"
            :min="1"
            :max="20"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addChapter('chapterForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail } from "@/api/Teacher/courseManage";
import { addChapter, getAll } from "@/api/Teacher/chapterManage";
import ChapterAdditionCard from "@/views/teacher/components/ChapterAdditionCard";
export default {
  components: {
    ChapterAdditionCard,
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
        remark: [
          { required: true, message: "请输入章节描述", trigger: "blur" },
        ],
      },
      dialogVisable: false,
      chapterForm: {
        name: "",
        remark: "",
        rank: "",
        parentId: -1,
        courseId: "",
      },
      difficultys: ["简单", "中等", "困难"],
      details: {
        categoryName: "",
        description: "",
        difficulty: "",
        directionName: "",
        email: "",
        id: "",
        name: "",
        notice: "",
        objectives: "",
        point: "",
        realname: "",
        sex: "",
      },
      chapters: [],
    };
  },
  methods: {
    addChapter(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let res = await addChapter(this.chapterForm);
            this.chapters.push(res.data);
            this.dialogVisable = false;
          } catch (error) {
            this.$message({
              type: "warning",
              message: "系统异常",
            });
          }
        }
      });
    },
    goBack() {
      this.$router.push({
        path: "/courseManage/list"
      })
    }
  },
  async created() {
    let id = this.$route.query.id;
    try {
      let res = await getDetail(id);
      this.chapterForm.courseId = id;
      this.details = res.data;
      let chapters = await getAll(id);
      this.chapters = chapters.data;
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

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  margin-top: 20px;
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

pre {
  width: 80%;
  margin: 0;
  padding: 10px;
}

.addChapterParentNode {
  margin: 20px 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  font-size: 26px;
  font-weight: 400;
  color: #dcdfe6;
  cursor: pointer;
}

.addChapterParentNode:hover {
  color: #3465a2;
  border: 2px dashed #3465a2;
}
</style>