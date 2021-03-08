<template>
  <div>
    <el-card class="ChapterCard" shadow="always">
      <div class="cardHeader">
        <h3 class="chapterName">
          {{ chapterName }}
          <i class="el-icon-edit" @click="changeChapterName"></i>
        </h3>
        <p class="desc">{{ remark }}</p>
      </div>
      <!--  -->
      <div
        @click="toContent(sample.id, sample.name)"
        class="item"
        v-for="(sample, index) in children"
        :key="index"
      >
        <i class="el-icon-document">
          {{ chapterIndex + "-" + (index + 1) + sample.name }}</i
        >
        <div class="optionsBox">
          <el-tooltip
            effect="dark"
            content="修改名称"
            placement="top"
          >
            <i class="el-icon-edit" @click.stop="changeCourseName(sample)"></i>
          </el-tooltip>

          <el-tooltip
            effect="dark"
            content="添加作业"
            placement="top"
          >
            <i class="el-icon-document-add" @click.stop="changeCourseName(sample)"></i>
          </el-tooltip>

          <i class="el-icon-close"></i>
        </div>
      </div>
      <!--  -->
      <div class="addCourse" @click="dialogVisable = true">
        <i class="el-icon-plus">添加一节课时</i>
      </div>
    </el-card>
    <el-dialog title="新增课程" :visible.sync="dialogVisable">
      <el-form :model="courseForm" ref="courseForm" :rules="rules">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程序号">
          <el-input-number
            v-model="courseForm.rank"
            controls-position="right"
            :min="1"
            :max="20"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addCourse('courseForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addChapterCourse, changeName } from "@/api/Teacher/chapterManage";
export default {
  name: "ChapterAdditionCard",
  props: {
    selfId: Number,
    chapterName: String,
    remark: String,
    courseId: Number,
    parentId: Number,
    chapterIndex: Number,
    children: Array,
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
      },
      dialogVisable: false,
      courseForm: {
        name: "",
        rank: "",
        courseId: this.courseId,
        parentId: this.parentId,
      },
    };
  },
  methods: {
    addCourse(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let res = await addChapterCourse(this.courseForm);
            this.children.push(res.data);
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.dialogVisable = false;
            this.courseForm.name = "";
            this.courseForm.rank = "";
          } catch (error) {
            this.$message({
              type: "warning",
              message: "服务器异常",
            });
          }
        }
      });
    },
    changeChapterName() {
      this.$prompt("正在更改章节名称", "更改", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          changeName({ id: this.selfId, name: value })
            .then(() => {
              this.chapterName = value;
              this.$message({
                type: "success",
                message: "更改完成",
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "操作失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    changeCourseName(sample) {
      this.$prompt("正在更改课程名称", "更改", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          changeName({ id: sample.id, name: value })
            .then(() => {
              sample.name = value;
              this.$message({
                type: "success",
                message: "更改完成",
              });
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "warning",
                message: "操作失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    toContent(id, title) {
      this.$router.push({
        path: "/courseContentViewer",
        query: {
          id: id,
          courseId: this.courseId,
          title: title,
        },
      });
    },
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.item {
  display: flex;
  flex-direction: row;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
}

.optionsBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item:hover {
  cursor: pointer;
  background: rgba(12, 35, 138, 0.05);
  border-radius: 4px;
  color: #3465a2;
}

.item:hover > div > .el-icon-edit {
  opacity: 1;
}

.item:hover > div > .el-icon-close {
  opacity: 1;
}

.item:hover > div > .el-icon-document-add {
  opacity: 1;
  cursor: pointer;
}

.el-icon-edit {
  opacity: 0;
  margin-right: 15px;
}

.el-icon-edit:hover {
  cursor: pointer;
}


.el-icon-document-add {
  opacity: 0;
  margin-right: 10px;
}

.el-icon-close {
  opacity: 0;
  margin-left: 5px;
}

.chapterName:hover > .el-icon-edit {
  opacity: 1;
  color: #3465a2;
}

.desc:hover > .el-icon-edit {
  opacity: 1;
  color: #3465a2;
}

.addCourse {
  margin: 20px 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  font-size: 20px;
  font-weight: 400;
  color: #dcdfe6;
  cursor: pointer;
}

.addCourse:hover {
  color: #3465a2;
  border: 1px dashed #3465a2;
}

.ChapterCard {
  margin-top: 20px;
}

.chapterName {
  margin: 0;
}

.desc {
  font-size: 12px;
}
</style>