<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>考试管理</p>
        </div>
        <div class="header-right">
          <el-button
            @click="
              dialogFormVisible = true;
              isModify = false;
            "
            icon="el-icon-plus"
            type="primary"
            plain
            >添加考试</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="#" width="50"> </el-table-column>
          <el-table-column prop="name" label="考试名称" width="300">
          </el-table-column>
          <el-table-column
            width="200"
            prop="startTime"
            label="起始时间"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="endTime"
            label="结束时间"
          ></el-table-column>
          <el-table-column width="150" prop="status" label="状态">
            <template v-slot="props">
              <el-tag
                v-if="props.row.status === 0"
                type="warning"
                effect="dark"
              >
                未开始
              </el-tag>
              <el-tag
                v-if="props.row.status === 1"
                type="success"
                effect="dark"
              >
                进行中
              </el-tag>
              <el-tag v-if="props.row.status === 2" type="danger" effect="dark">
                已结束
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="props">
              <el-button
                size="mini"
                icon="el-icon-edit-outline"
                type="info"
                plain
                @click="handlePreview(props.row.paperId)"
                >预览试卷</el-button
              >
              <el-button
                @click="handleUpdate(props.row)"
                size="mini"
                icon="el-icon-edit-outline"
                type="primary"
                plain
                >编辑</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-edit-outline"
                type="danger"
                plain
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  -->
    <el-dialog title="考试信息" :visible.sync="dialogFormVisible">
      <el-form label-position="right" :model="examForm">
        <el-form-item label="考试名称">
          <el-input style="width: 220px" v-model="examForm.name"></el-input>
        </el-form-item>
        <el-form-item label="选择课程">
          <el-cascader
            :options="optionData"
            :key="cascaderKey"
            v-model="optionValue"
            class="cascader"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="duration"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择试卷">
          <el-select v-model="examForm.paperId" placeholder="请选择">
            <el-option
              v-for="item in papers"
              :key="item.id"
              :label="item.title"
              :value="parseInt(item.id)"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <el-dialog :visible.sync="isPreview">
      <div class="exercise" v-for="(sample, index) in paperDetail" :key="index">
        <p style="color: 3465a2">第{{index + 1}}题</p>
        <div v-html="sample.content" class="content"></div>
        <div class="options">
          <div class="item" v-for="(x, i) in sample.options" :key="i">
            <span class="chooser">{{ String.fromCharCode(i + 65) }}</span>
            {{ x }}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isPreview = false">结束预览</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseTree } from "@/api/Teacher/courseManage";
import {
  getPapersByCategory,
  getPaperExercises,
} from "@/api/paper.js";
import { saveExam, getTeachersExam, modifyExam } from "@/api/exam.js";
import formatDate from "@/utils/formatDate.js";
export default {
  data() {
    return {
      isModify: false,
      isPreview: false,
      tableData: [],
      examForm: {
        id: "",
        name: "",
        courseId: 0,
        paperId: "",
        startTime: "",
        endTime: "",
      },
      cascaderKey: 1,
      optionData: [],
      optionValue: [],
      papers: [],
      dialogFormVisible: false,
      duration: [],
      paperDetail: [],
    };
  },
  watch: {
    optionData() {
      ++this.cascaderKey;
    },
  },
  methods: {
    async handlePreview(paperId) {
      let res = await getPaperExercises(paperId);
      this.paperDetail = res.data;
      this.paperDetail.map((x) => {
        x.options = x.options.split(";");
      });
      this.isPreview = true;
    },
    async handleUpdate(data) {
      this.examForm.id = data.id;
      this.examForm.name = data.name;
      this.dialogFormVisible = true;
      this.isModify = true;
    },
    async handleChange(value) {
      this.optionValue = value;
      let categoryId = value[1];
      let res = await getPapersByCategory(categoryId);
      this.papers = res.data;
      this.examForm.courseId = value[2];
    },
    async handleSave() {
      let date1 = new Date(this.duration[0]);
      let date2 = new Date(this.duration[1]);
      let time1, time2;
      time1 = formatDate(date1);
      time2 = formatDate(date2);
      this.examForm.startTime = time1;
      this.examForm.endTime = time2;
      if (this.examForm.name === "") {
        this.$message.error("请输入考试名称");
      } else if (
        this.examForm.courseId === 0 ||
        this.examForm.courseId === null
      ) {
        this.$message.error("请选择课程");
      } else if (
        this.examForm.paperId === "" ||
        this.examForm.courseId === null
      ) {
        this.$message.error("请选择试卷");
      } else {
        try {
          if (!this.isModify) {
            await saveExam(this.examForm);
            this.$message.success("考试添加成功");
            this.dialogFormVisible = false;
          } else {
            await modifyExam(this.examForm);
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
          }
          let res = await getTeachersExam();
          this.tableData = res.data.rows;
          this.tableData.map((x) => {
            x.startTime = formatDate(x.startTime);
            x.endTime = formatDate(x.endTime);
          });
          _clearForm();
        } catch (error) {}
      }
    },
    _clearForm() {
      this.examForm = {
        name: "",
        courseId: 0,
        paperId: "",
        startTime: "",
        endTime: "",
      };
    },
  },
  async created() {
    try {
      let res = await Promise.all([getCourseTree(), getTeachersExam()]);
      this.optionData = res[0].data;
      this.tableData = res[1].data.rows;
      this.tableData.map((x) => {
        x.startTime = formatDate(x.startTime);
        x.endTime = formatDate(x.endTime);
      });
    } catch (error) {}
  },
};
</script>

<style scoped>
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  box-shadow: 0px 0px 12px 1px #aaa;
  min-height: 800px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
  border-bottom: 1px solid #dae1ed;
}

.header-left > p {
  font-size: 24px;
  font-weight: 500;
  color: #3465a2;
}

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  margin-top: 20px;
}

.exercise {
  padding: 30px;
  margin: 15px 10px;
  box-shadow: 2px 2px 12px 5px rgba(12, 35, 138, 0.1);
  border-radius: 5px;
}

.chooser {
  border: 1px solid #3465a2;
  border-radius: 50%;
  color: #3465a2;
  padding: 1px 6px;
}

.options > .item {
  margin: 10px 0;
  border: none;
}
</style>