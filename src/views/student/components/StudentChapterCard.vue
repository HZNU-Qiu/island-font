<template>
  <div>
    <el-card class="ChapterCard" shadow="always">
      <div class="cardHeader">
        <h3 class="chapterName">
          {{ chapterName }}
        </h3>
        <p class="desc">{{ remark }}</p>
      </div>
      <!--  -->
      <div class="item" v-for="(sample, index) in children" :key="index">
        <i :class="sample.hasDone ? 'el-icon-check' : 'el-icon-document'">
          {{ chapterIndex + "-" + (index + 1) + sample.name }}</i
        >
        <div class="optionsBox">
          <el-button
            @click="toContent(sample.id, sample.name)"
            :disabled="!hasStudied"
            class="toStudyBtn"
            size="mini"
            round
            >{{sample.hasDone?'查看结果':'前往学习'}}</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "StudentChapterCard",
  props: {
    hasStudied: Boolean,
    selfId: Number,
    chapterName: String,
    remark: String,
    courseId: Number,
    parentId: Number,
    chapterIndex: Number,
    children: Array,
  },
  data() {
    return {
      courseForm: {
        name: "",
        rank: "",
        courseId: this.courseId,
        parentId: this.parentId,
      },
    };
  },
  methods: {
    toContent(id, title) {
      this.$router.push({
        path: "/student/learning",
        query: {
          id: id,
          title: title,
          courseId: this.courseId
        },
      });
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
}

.optionsBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item:hover {
  cursor: pointer;
  background: rgba(12, 35, 138, 0.05);
  border-radius: 4px;
  color: #3465a2;
}

.item:hover > div > .toStudyBtn {
  opacity: 1;
}

.ChapterCard {
  margin-top: 20px;
}

.toStudyBtn {
  background-color: #3465a2;
  color: #fff;
  font-weight: 400;
  opacity: 0;
}

.toStudyBtn:hover {
  background-color: #244670;
}

.el-icon-check::before {
  color: #fff;
  background-color: #00ff22;
  border-radius: 50%;
}
</style>