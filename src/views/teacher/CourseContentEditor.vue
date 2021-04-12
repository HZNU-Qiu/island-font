<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>{{ title }}</p>
        </div>
        <div class="header-right">
          <el-button
            @click="handleSave"
            class="btn"
            icon="el-icon-finished"
            type="primary"
            plain
            >保存</el-button
          >
          <el-button
            @click="handleCancel"
            class="btn"
            icon="el-icon-arrow-left"
            plain
            >返回</el-button
          >
        </div>
      </div>
      <div class="main">
        <div class="editor" style="width: 78%">
          <Editor v-model="content"></Editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/Simditor";
import { saveContent } from "@/api/Teacher/course";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      id: "",
      title: "",
      chapterId: "",
      visible: 1,
      content: "",
      isModify: "",
      courseId: "",
    };
  },
  methods: {
    handleCancel() {
      this.$router.push({
        path: "/courseContentViewer",
        query: {
          id: this.chapterId,
          title: this.title,
          courseId: this.courseId,
        },
      });
    },
    async handleSave() {
      if (!this.isModify) {
        let formData = {};
        formData.chapter_id = this.chapterId;
        formData.content = this.content;
        formData.visible = 1;
        formData.flag = 0;
        try {
          let res = await saveContent(formData);
          this.id = res.data.id;
          this.$message({
            type: "success",
            message: "创建成功",
          });
          this.$router.push({
            path: "/courseContentViewer",
            query: {
              id: this.chapterId,
              title: this.title,
              courseId: this.courseId
            },
          });
        } catch (error) {
          this.$message({
            type: "warning",
            message: "服务异常",
          });
        }
      } else {
        let formData = {};
        formData.id = this.id;
        formData.content = this.content;
        formData.flag = 1;
        try {
          let res = await saveContent(formData);
          this.id = res.data.id;
          this.$message({
            type: "success",
            message: "创建成功",
          });
          this.$router.push({
            path: "/courseContentViewer",
            query: {
              id: this.chapterId,
              title: this.title,
              courseId: this.courseId
            },
          });
        } catch (error) {
          this.$message({
            type: "warning",
            message: "服务异常",
          });
        }
      }
    },
  },
  async created() {
    this.chapterId = this.$route.query.chapterId;
    this.title = this.$route.query.title;
    this.content = this.$route.query.content;
    this.isModify = this.$route.query.isModify;
    this.id = this.$route.query.id;
    this.courseId = this.$route.query.courseId;
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
  background: #fdfdfd;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.options > .btn {
  box-sizing: border-box;
  margin: 20px 10px;
  display: block;
  width: 48px;
  height: 48px;
  font-size: 20px;
  font-weight: 400;
  box-shadow: 0 5px 8px 0 rgba(95, 101, 105, 0.3);
}

.editor >>> .simditor {
  box-shadow: 0 4px 8px 3px rgba(77, 82, 85, 0.3);
  border: none;
  border-radius: 0 0 8px 8px;
  min-height: 500px;
  margin-top: 30px;
}

.editor >>> .simditor-body {
  min-height: 500px;
}
</style>