<template>
  <el-card class="box-card">
    <div class="problem-description">
      <b>题目描述:</b>
      <br />
      {{p.problem_description}}
    </div>
    <div class="input-description">
      <b>输入描述:</b>
      <br />
      <pre>{{p.input_description}}</pre>
    </div>
    <div class="output-description">
      <b>输出描述:</b>
      <br />
      <pre>{{p.output_description}}</pre>
    </div>
    <div>
      <b>示例输出:</b>
      <br />
      <div class="example">
        <b>输入</b>
        <pre>{{p.example.input}}</pre>
        <b>输出</b>
        <pre>{{p.example.output}}</pre>
        <b>说明</b>
        <pre>{{p.example.description}}</pre>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name:'Problem',
  props:{
    p:{
      type:Object,
      default:()=>{}
    }
  },
}
</script>

<style scoped>
div {
  margin: 10px;
}
pre {
  position: relative;
  border-left: 2px solid #1abc9c;
  padding: 10px 0 10px 10px;
  margin: 0.8em 0;
  background: #fafafa;
  word-break: break-word;
}
.box-card {
  text-align: left;
  font-size: 0.9rem;
  line-height: 2rem;
  font-family: sans-serif;
  height: 850px;
}
.example {
  border: 1px solid #e8edf2;
  background: #eaf0f5;
  padding: 10px;
  border-radius: 4px;
  position: relative;
}
</style>