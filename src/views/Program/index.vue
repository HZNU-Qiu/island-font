<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="12">
        <Problem :p="problem"></Problem>
      </el-col>
      <el-col :span="12">
        <CodeEditor @submit="submit"></CodeEditor>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import CodeEditor from '@/components/CodeEditor'
import Problem from '@/components/Problem'
import * as Api from '@/api/User/program'

export default {
  name: 'Program',
  components:{
    CodeEditor,
    Problem
  },
  data(){
    return{
      problem:{
        input_description:'【重要】输入为一行，两个数字A和B，中间用空格隔开。',
        output_description:'只有一个输出，输出A+B=？，记得换行。',
        problem_description:'A+B的问题不仅使我们学习算数加法的入门问题，同时也是学习C语言编程的入门问题，在HelloWorld之后尝试一下让计算机也来运算一下A+B的问题吧。',
        example:{
          input:"1 2",
          output:"3",
          description:"1+2=3 没有意见吧？"
        }
      }
    }
  },
  methods:{
    submit(value){
      console.log(value)
      Api.submit({'code': value}).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
