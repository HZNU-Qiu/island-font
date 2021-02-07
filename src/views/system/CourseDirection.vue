<template>
  <div>
    <div class="panel" v-if="!showTags">
      <div class="header">
        <div class="header-left">
          <p>课程方向管理</p>
        </div>
      </div>
      <div class="mainer">
        <!-- 在组件上绑定click需要加上.native表示原生事件 -->
        <DirectionBoard
          v-for="(sample, index) in directions"
          :key="index"
          :id="sample.id"
          :name="sample.name"
          :description="sample.description"
          @modifyThis="openModifyDialog"
          @click.native="getTags(sample.id, sample.name)"
        ></DirectionBoard>
        <div class="addDirection" @click="openCreateDialog">
          <div class="el-icon-plus"></div>
          <h1>添加一个课程方向</h1>
        </div>
      </div>
    </div>
    <CourseCategoryManager
      v-else
      :direction="direction"
      :name="name"
      @showTagsClose="backToThis"
    ></CourseCategoryManager>

    <!-- 课程方向编辑对话框 -->
    <el-dialog
      :title="isAdd ? '创建课程方向' : '编辑课程方向'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="formData" :rules="rules" ref="addDir">
        <el-form-item label="方向名称" prop="directionName">
          <el-input
            v-model="formData.directionName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="方向描述" prop="directionDesc">
          <el-input
            v-model="formData.directionDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('addDir')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DirectionBoard from "./components/DirectionBoard";
import CourseCategoryManager from "./components/CourseCategoryManager";
import {
  addCourseDirection,
  listAll,
  modifyCourseDirection,
} from "@/api/System/courseDirection";
export default {
  components: {
    DirectionBoard,
    CourseCategoryManager,
  },
  data() {
    return {
      rules: {
        directionName: [
          { required: true, message: "方向名称不能为空", trigger: "blur" },
        ],
        directionDesc: [
          { required: true, message: "方向描述不能为空", trigger: "blur" },
        ],
      },
      directions: [],
      direction: 1,
      name: "",
      showTags: false,
      dialogFormVisible: false,
      isAdd: true,
      formData: {
        directionName: "",
        directionDesc: "",
      },
    };
  },
  methods: {
    async backToThis() {
      this.showTags = false;
      try {
        let res = await listAll();
        this.directions = res.data;
      } catch (error) {
        this.$message({
          type: "danger",
          message: "系统异常",
        });
      }
    },
    openCreateDialog() {
      this.isAdd = true;
      this.formData.directionName = "";
      this.formData.directionDesc = "";
      this.formData.id = "";
      this.dialogFormVisible = true;
    },
    addADireticon(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let res = await addCourseDirection(this.formData);
            this.directions.push(res.data);
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "创建成功",
            });
          } catch (error) {
            this.$message({
              type: "warning",
              message: "添加信息有误",
            });
          }
        }
      });
    },
    getTags(id, name) {
      this.direction = id;
      this.name = name;
      this.showTags = true;
    },
    openModifyDialog(oldData) {
      this.isAdd = false;
      this.dialogFormVisible = true;
      this.formData.directionName = oldData.name;
      this.formData.directionDesc = oldData.description;
      this.formData.id = oldData.id;
    },
    async modifyThis(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await modifyCourseDirection(this.formData);
            this.isAdd = true;
            this.dialogFormVisible = false;
            let res = await listAll();
            this.directions = res.data;
            this.$message({
              type: "success",
              message: "编辑成功",
            });
          } catch (error) {
            this.$message({
              type: "warning",
              message: "填写信息有误",
            });
          }
        }
      });
    },
    handleSubmit(formName) {
      if (this.isAdd) {
        this.addADireticon(formName);
      } else {
        this.modifyThis(formName);
      }
    },
  },
  async created() {
    let res = await listAll();
    this.directions = res.data;
  },
};
</script>

<style>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  box-shadow: 0px 0px 12px 1px #aaa;
  min-height: 1000px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dae1ed;
}

.header-left > p {
  font-size: 24px;
  font-weight: 500;
  color: #3465a2;
}

.mainer {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  padding: 10px 10px 10px 30px;
}

.addDirection {
  width: 300px;
  height: 200px;
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: center;
  color: #aaa;
  cursor: pointer;
  border-radius: 5px;
  border: 1px dashed #aaa;
  margin: 30px 20px;
  overflow: hidden;
  padding-top: 60px;
}

.addDirection:hover {
  border: 1px dashed #3465a2;
  color: #3465a2;
}

.addDirection > .el-icon-plus {
  font-size: 32px;
}
</style>