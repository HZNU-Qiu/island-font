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
            <Simditor ></Simditor>
        </el-form-item>

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
  }

}
</script>

<style>
</style>