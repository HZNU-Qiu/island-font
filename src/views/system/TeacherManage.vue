<template>
  <div>
    <div class="panel" v-if="!showEdit && !showModify">
      <div class="header">
        <div class="header-left">
          <p>教师信息管理</p>
        </div>
        <div class="header-right">
          <el-input
            class="search_input"
            v-model="searchKey"
            placeholder="输入姓名筛选"
          >
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
          <el-button
            @click="addStudent"
            class="addStudent"
            type="primary"
            icon="el-icon-plus"
            plain
            >添加教师</el-button
          >
        </div>
      </div>

      <div class="mainer">
        <el-table
          :data="
            tableData.filter(
              (data) =>
                !searchKey ||
                data.realname.toLowerCase().includes(searchKey.toLowerCase())
            )
          "
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <div class="details">
                <img
                  :src="`http://localhost:8020${props.row.avatar}`"
                  alt="哦豁,我图没咯"
                />
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="学校:">
                    <span>{{ props.row.university }}</span>
                  </el-form-item>
                  <el-form-item label="学院:">
                    <span>{{ props.row.school }}</span>
                  </el-form-item>
                  <el-form-item label="系别:">
                    <span>{{ props.row.department }}</span>
                  </el-form-item>
                  <el-button type="info" style="width: 150px" @click="handleStatusModify(props.row)" plain
                    >修改学籍信息</el-button
                  >
                </el-form>
              </div>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column
            label="用户名"
            prop="username"
            width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="关联账号ID"
            :show-overflow-tooltip="true"
            prop="openid"
            width="200"
          >
            <template v-slot="props">
              <div v-if="props.row.openid" class="content">
                {{ props.row.openid }}
              </div>
              <div v-else>
                <el-tag type="warning">未绑定</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="200" prop="realname">
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content">{{ props.row.realname }}</div>
              </div>
              <div v-else class="table-edit">
                <el-input v-model="props.row.realname" placeholder></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="性别" prop="sex" width="150">
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content">
                  {{ props.row.sex === 1 ? "男" : "女" }}
                </div>
              </div>
              <div v-else class="table-edit">
                <el-select v-model="props.row.sex" placeholder>
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="邮箱地址"
            prop="email"
            :show-overflow-tooltip="true"
            width="300"
          >
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content email">{{ props.row.email }}</div>
                <div class="cell-icon" @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
              </div>
              <div v-else class="table-edit">
                <el-input
                  v-model="props.row.email"
                  placeholder
                  class="emailEditor"
                ></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" min-width="250" label="操作">
            <template v-slot="props">
              <el-button
                size="mini"
                type="primary"
                @click="handleCellEdit(props.row)"
                plain
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                style="margin-left: 30px"
                plain
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="15"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 学生创建窗口 -->
    <TeacherAddition v-else-if="showEdit" @editClose="editClose"></TeacherAddition>
    <!-- 学生学籍信息修改对话框 -->
    <ModifyTeacherStatus v-if="showModify" @modifyClose="modifyClose" :oldData="oldData"></ModifyTeacherStatus>
  </div>
</template>

<script>
import {
  getTeachersByPage,
  modifyTeacherInfo,
} from "@/api/System/userManage";

import TeacherAddition from "./components/AddTeacher";
import ModifyTeacherStatus from "./components/ModifyTeacherStatus";
export default {
  components: {
    TeacherAddition,
    ModifyTeacherStatus,
  },
  data() {
    return {
      showEdit: false,
      showModify: false,
      searchKey: "",
      total: 0,
      tableData: [],
      oldData: {}
    };
  },
  methods: {
    editClose() {
      this.showEdit = false;
      getTeachersByPage(1).then((res) => {
        this.tableData = res.data.tableData;
        this.total = res.data.total;
      });
    },
    modifyClose() {
      this.showModify = false;
      getTeachersByPage(1).then((res) => {
        this.tableData = res.data.tableData;
        this.total = res.data.total;
      });
    },
    handleStatusModify(row) {
      this.oldData.teacherName = row.realname
      this.oldData.id = row.id
      this.oldData.oldAvatar = row.avatar
      this.oldData.universityID = row.university_id
      this.oldData.schoolID = row.school_id
      this.oldData.departmentID = row.department_id
      this.showModify = true
      console.log(this.oldData)
    },
    handleCellEdit(row) {
      row.editFlag = true;
      this.realname_tmp = row.realname;
      this.sex_tmp = row.sex;
      this.email_tmp = row.email;
    },
    handleCellSave(row) {
      row.editFlag = false;
      let { realname, sex, email, id } = row;
      modifyTeacherInfo({ realname, sex, email, id }).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功",
        });
      });
    },
    handleCellCancel(row) {
      row.editFlag = false;
      row.realname = this.realname_tmp;
      row.sex = this.sex_tmp;
      row.email = this.email_tmp;
    },
    addStudent() {
      this.showEdit = true;
    },
  },
  created() {
    getTeachersByPage(1).then((res) => {
      this.tableData = res.data.tableData;
      this.total = res.data.total;
    });
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  box-shadow: 0px 0px 12px 1px #aaa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
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

.search_input >>> .el-input-group__append {
  border-left: 0;
  border-radius: 0 20px 20px 0;
  background: #3465a2;
  color: #dae1ed;
}

.search_input >>> .el-input__inner {
  width: 150px;
  border-radius: 20px 0 0 20px;
  transition: all 0.7s;
}

.search_input >>> .el-input__inner:focus {
  width: 300px;
  transition: all 0.7s;
}

.addStudent {
  margin-left: 30px;
}

.table-edit {
  display: flex;
  flex-direction: row;
}

.email {
  width: 200px;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-icon-edit {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cell-save,
.cell-cancel {
  margin: 0 5px 0 5px;
  color: #3465a2;
  font-size: 18px;
}

.cell-icon {
  margin-left: 110px;
  color: #3465a2;
  font-size: 18px;
}

.cell-save:hover,
.cell-cancel:hover,
.cell-icon:hover {
  cursor: pointer;
}

.emailEditor {
  width: 250px;
}

.table-expand {
  font-size: 0;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.details > img {
  display: block;
  width: 180px;
  height: 240px;
  border: 1px solid #dae1ed;
  padding: 2px;
  border-radius: 5px;
}

.table-expand > label {
  width: 90px;
  color: #99a9bf;
}

.table-expand > .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
}

.footer {
  border-top: 1px solid #dae1ed;
  padding: 30px 0 50px 0;
}
</style>