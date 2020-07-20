<template>
  <div class="panel">
    <div class="header">
      <h2>Ctreating An Experiment !</h2>
    </div>
    <div class="body">
      <el-form label-width="100px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Display ID" prop="displayId">
              <el-input placeholder="Display ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="Title" prop="title">
              <el-input placeholder="Title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Description" prop="description">
          <Simditor></Simditor>
        </el-form-item>

        <el-form-item label="Input Description" prop="input_description">
          <Simditor></Simditor>
        </el-form-item>

        <el-form-item label="Output Description" prop="output_description">
          <Simditor></Simditor>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Time Limit(ms)" prop="time_limit">
              <el-input-number
                style="width: 100%"
                v-model="time_limit"
                controls-position="right"
                :min="100"
                :max="5000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Memory Limit(MB)" prop="memory_limit">
              <el-input-number
                style="width: 100%"
                v-model="memory_limit"
                controls-position="right"
                :min="10"
                :max="256"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Difficulty" prop="difficulty">
              <el-select placeholder="Low" value="1">
                <el-option label="Low" value="1"></el-option>
                <el-option label="Mid" value="2"></el-option>
                <el-option label="High" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Visible" prop="visible">
              <el-switch v-model="visible" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Points" prop="points">
              <el-input-number
                style="width: 100%"
                v-model="points"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 60px">
            <el-form-item label="Languages" prop="languages">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="C"></el-checkbox>
                <el-checkbox label="C++"></el-checkbox>
                <el-checkbox label="Java"></el-checkbox>
                <el-checkbox label="Python2"></el-checkbox>
                <el-checkbox label="Python3"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Simditor from '@/components/Simditor'
export default {
  name: 'Create',
  components: {
    Simditor,
  },
  data() {
    return {
      time_limit: 1000,
      memory_limit: 32,
      visible: 1,
      points: 100,
      checkList: ['C', 'C++']
    }
  }

}
</script>

<style>
</style>