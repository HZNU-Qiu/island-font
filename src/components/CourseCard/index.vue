<template>
  <a class="course">
    <div class="title1">
      <p>{{ course.name }}</p>
    </div>
    <p class="title2">{{ course.name }}</p>
    <p class="one">{{ course.difficulty }}·{{ course.students }}人学习过</p>
    <div class="two">
      <p class="point">{{ course.point === 0 ? "暂无评分" : course.point }}</p>
      <i
        :class="[course.hasCollected?'el-icon-star-off':'el-icon-star-on']"
        >{{ course.hasCollected ? "点我收藏" : "点我取消" }}</i
      >
    </div>
  </a>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    course: Object,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.course {
  position: relative;
  width: 270px;
  height: 270px;
  float: left;
  margin: 0 20px 20px 0;
  box-shadow: 0 5px 8px 0 rgba(95, 101, 105, 0.3);
  border-radius: 8px;
  background-color: #fff;
}

.title1 {
  display: flex;
  padding: 10px;
  height: 55%;
  font-size: 24px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(to right, #fb7299, #ff5c7c);
  border-radius: 8px 8px 0 0;
}

.title2 {
  color: #545c63;
  line-height: 20px;
  height: 40px;
  margin-bottom: 8px;
  padding: 0 8px;
}

.one {
  font-size: 12px;
  color: #9199a1;
  line-height: 18px;
  padding: 0 8px;
  margin-bottom: 8px;
}

.two {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  color: #9199a1;
  line-height: 18px;
  padding: 0 8px;
  margin-bottom: 8px;
}

.point {
  margin: 0;
  padding: 0;
}

.el-icon-star-off {
  margin-top: 3px;
}

.el-icon-star-on {
  margin-top: 3px;
}

.el-icon-star-on::before {
  color: #ff5c7c;
}
</style>