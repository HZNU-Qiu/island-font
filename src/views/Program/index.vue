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

export default {
  name: 'Program',
  components:{
    CodeEditor,
    Problem
  },
  data(){
    return{
      problem:{
        input_description:'【重要】第一行为数组的长度N（N>=1）  接下来N行，每行一个数，代表数组的N个元素',
        output_description:'最大和的结果',
        problem_description:'输入一个整形数组（可能有正数和负数），求数组中连续子数组（最少有一个元素）的最大和。要求时间复杂度为O(n)。',
        example:{
          input:"8 1 -2 3 10 -4 7 2 -5",
          output:"18",
          description:"最大子数组为 3, 10, -4, 7, 2"
        }
      }
    }
  },
  methods:{
    submit(value){
      this.$message.success('代码：'+value)
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
