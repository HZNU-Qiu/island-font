<template>
  <el-card class="box-card">
    <div class="problem-description">
      <b>题目描述:</b>
      <br />
      <div v-html="p.content"></div>
    </div>
    <div class="input-description">
      <b>输入描述:</b>
      <br />
      <div v-html="p.inputDesc"></div>
    </div>
    <div class="output-description">
      <b>输出描述:</b>
      <br />
      <div v-html="p.outputDesc"></div>
    </div>
    <div>
      <b>示例输出:</b>
      <br />
      <div class="example">
        <b>输入</b>
        <p>{{ p.inputSample }}</p>
        <b>输出</b>
        <p>{{ p.outputSample }}</p>
        <b>提示</b>
        <p>{{ p.hint }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Problem",
  props: {
    p: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

div {
  margin: 10px;
}
.example > p {
  position: relative;
  border-left: 2px solid #1abc9c;
  padding: 10px 0 10px 10px;
  margin: 0.8em 0;
  background: #fafafa;
  white-space: pre-wrap;
  word-break: break-word;
}

.problem-description > div,
.input-description > div,
.output-description > div {
  position: relative;
  border-left: 2px solid #3465a3;
  padding: 10px 0 10px 10px;
  margin: 0.8em 0;
  background: #fafafa;
  white-space: pre-wrap;
  word-break: break-word;
}

.box-card {
  text-align: left;
  font-size: 0.9rem;
  line-height: 2rem;
  font-family: sans-serif;
  padding: 30px 0;
}
.example {
  border: 1px solid #e8edf2;
  background: #eaf0f5;
  padding: 10px;
  border-radius: 4px;
  position: relative;
}

b {
  font-size: 16px;
  color: #3465a2;
}
</style>