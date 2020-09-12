<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="12">
        <Problem :p="problem"></Problem>
      </el-col>
      <el-col :span="12">
        <el-table
          :data="[{'time_limit': time_limit, 'memory_limit': memory_limit, 'points': points, 'ac_rate': ac_rate}]"
          border
          style="width: 100%;margin-top: 15px;"
        >
          <el-table-column prop="time_limit" label="Time Limit (MS)" width="150"></el-table-column>
          <el-table-column prop="memory_limit" label="Memory Limit (MB)" width="180"></el-table-column>
          <el-table-column prop="points" label="Points" width="180"></el-table-column>
          <el-table-column prop="ac_rate" label="AC Rate (%)"></el-table-column>
        </el-table>

        <!-- <CodeEditor @submit="submit"></CodeEditor> -->
        <CodeMirror :value.sync="code" @resetCode="onResetCode" @changeLang="onLangChange"></CodeMirror>
        <el-button type="primary" @click="submit()" style="width: 150px; height: 50px" plain>Submit</el-button>
        <el-tag v-if="problem_status===0" class="result_tag" type="info"><i class="el-icon-coffee-cup"></i>Waiting to submit</el-tag>
        <el-tag v-else-if="problem_status===1" class="result_tag" type="warning"><i class="el-icon-loading"></i>Pending! Good luck!</el-tag>
        <el-tag v-else-if="problem_status===2" class="result_tag" type="success"><i class="el-icon-circle-check"></i>Your code has been accepted!Yeah~</el-tag>
        <el-tag v-else class="result_tag" type="danger"><i class="el-icon-circle-close"></i>{{this.tag_text}}.Just try again:)</el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import CodeEditor from '@/components/CodeEditor'
import CodeMirror from '@/components/CodeMirror'
import Problem from '@/components/Problem'
import * as Api from '@/api/User/program'

export default {
  name: 'Program',
  components:{
    CodeEditor,
    Problem,
    CodeMirror
  },
  data(){
    return{
      code: '',
      lang: 'cpp',
      problem:{
        input_description:'【重要】输入为一行，两个数字A和B，中间用空格隔开。',
        output_description:'只有一个输出，输出A+B=？，记得换行。',
        problem_description:'A+B的问题不仅使我们学习算数加法的入门问题，同时也是学习C语言编程的入门问题，在HelloWorld之后尝试一下让计算机也来运算一下A+B的问题吧。',
        example:{
          input:"1 2",
          output:"3",
          description:"1+2=3 没有意见吧？"
        }
      },
      time_limit: '1000',
      memory_limit: '32',
      points: 100,
      ac_rate: 60.01,
      problem_status: 0,
      tag_type: 'info',
      tag_text: 'Waiting to submit'
    }
  },
  methods:{
    submit(){
      this.problem_status = 1
      Api.submit({'code': this.code}).then(res => {
        this.problem_status = res.result === 0 ? 2 : res.result
        this.tag_text = res.msg
      })
    },
    onResetCode() {
      this.code = ''
    },
    onLangChange(lang) {
      this.lang = lang
    }
  }
}
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
</style>
