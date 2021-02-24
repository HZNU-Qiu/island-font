<template>
  <div class="panel">
    <div class="header">
      <h2>Ctreating An Experiment !</h2>
    </div>
    <div class="body">
      <el-form label-width="100px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Display ID" prop="display_id">
              <el-input placeholder="Display ID" v-model="display_id" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="Title" prop="title">
              <el-input placeholder="Title" v-model="title" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Description" prop="description">
          <Editor></Editor>
        </el-form-item>

        <el-form-item label="Input Description" prop="input_description">
          <Editor></Editor>
        </el-form-item>

        <el-form-item label="Output Description" prop="output_description">
          <Editor></Editor>
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
              <el-select placeholder="Low" v-model="difficulty" :label="options[difficulty - 1]">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
                <el-checkbox label="Python3"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-for="(sample, index) in samples" :key="'sample'+index">
          <TestSamples :title="'Sample' + (index + 1)">
            <el-button type="danger" size="small" icon="el-icon-delete" slot="header" @click="removeSample(index)">Delete</el-button>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Input_Samples" required>
                  <el-input :rows="5" v-model="samples[index].input" type="textarea" :placeholder="index == 0?'Input_Samples1 will be shown.Please remember to set mutiple samples':'Input_Samples'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Output_Samples" required>
                  <el-input :rows="5" v-model="samples[index].output" type="textarea" :placeholder="index == 0?'Output_Samples1 will be shown.Please remember to set mutiple samples':'Output_Samples'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </TestSamples>
        </el-form-item>

        <div class="add-sample-btn">
          <button type="button" class="add-samples" @click="addSample()">
            <i class="el-icon-plus"></i>
            Add_Sample
          </button>
        </div>

        <el-form-item label="Hint" prop="hint">
          <Editor></Editor>
        </el-form-item>

        <el-button type="primary" size="medium" plain>Save</el-button>

      </el-form>
    </div>
  </div>
</template>

<script>
import Editor from '@/components/Simditor'
import TestSamples from './components/TestSamples'
export default {
  name: 'Create',
  components: {
    Editor,
    TestSamples
  },
  data() {
    return {
      options: [{label: 'Low', value: 1}, {label: 'Mid', value: 2}, {label: 'High', value: 3}],
      display_id: '',
      title: '',
      time_limit: 1000,
      memory_limit: 32,
      difficulty: 1,
      visible: 1,
      points: 100,
      checkList: ['C', 'C++'],
      samples: [{input: '', output: ''}]
    }
  },
  methods: {
    addSample() {
      this.samples.push({input: '', output: ''})
    },
    removeSample(index) {
      this.samples.splice(index, 1)
    }
  }

}
</script>

<style lang="scss" scoped>
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 10px;
  padding: 30px;
  box-shadow: 0px 0px 12px 1px #aaa;
}

.add-sample-btn {
  margin: 10px 0 10px 0;
}

.add-samples {
  width: 100%;
  background-color: #fff;
  border: 1px dashed #aaa;
  outline: none;
  cursor: pointer;
  color: #666;
  height: 35px;
  font-size: 14px;
  &:hover {
    background-color: #f9fafc;
  }
  i {
    margin-right: 10px;
  }
}
</style>