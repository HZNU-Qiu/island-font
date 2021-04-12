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
      <div class="main">
        <div class="options" v-if="hasContent">
          <el-button
            class="btn"
            @click="handleToEditor(1)"
            type="primary"
            icon="el-icon-edit"
            plain
            circle
          ></el-button>
        </div>
        <div v-if="hasContent" class="content" v-html="content"></div>
        <div v-if="!hasContent" @click="handleToEditor(0)" class="write">
          <i class="el-icon-edit-outline">编写课程内容</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/Simditor";
import { getContent } from "@/api/Teacher/course";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      id: "",
      title: "",
      chapterId: "",
      content: "",
      hasContent: true,
      courseId: "",
    };
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: "/courseDetail",
        query: {
          id: this.courseId,
        },
      });
    },
    handleToEditor(flag) {
      this.$router.push({
        path: "/courseContentEditor",
        query: {
          id: this.id,
          title: this.title,
          chapterId: this.chapterId,
          content: this.content,
          isModify: flag,
          courseId: this.courseId
        },
      });
    },
  },
  async created() {
    this.chapterId = this.$route.query.id;
    this.title = this.$route.query.title;
    this.courseId = this.$route.query.courseId;
    try {
      let res = await getContent(this.chapterId);
      if (res.data.find) {
        this.hasContent = true;
        this.content = res.data.content;
        this.id = res.data.id;
      } else {
        this.hasContent = false;
      }
    } catch (error) {
      this.$message({
        type: "warning",
        message: "服务器异常",
      });
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
  background: #fdfdfd;
  display: flex;
  justify-content: center;
}

.options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 200px;
  left: 83%;
}

.options > .btn {
  box-sizing: border-box;
  margin: 20px 10px;
  display: block;
  width: 68px;
  height: 68px;
  font-size: 32px;
  font-weight: 400;
  box-shadow: 0 5px 8px 0 rgba(95, 101, 105, 0.3);
}

.write {
  font-size: 32px;
  font-weight: 400;
  width: 70%;
  height: 600px;
  color: #f1f1f1;
  border: 2px dashed #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.write:hover {
  color: #aaa;
  border: 2px dashed #aaa;
  cursor: pointer;
}

.content {
  margin-top: 20px;
  width: 70%;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 5px 8px 0 rgba(95, 101, 105, 0.3);
  padding: 30px;
  background: #fff;
}

.content >>> p {
  word-break: break-all;
  word-wrap: break-word;
  line-height: 28px;
}
</style>