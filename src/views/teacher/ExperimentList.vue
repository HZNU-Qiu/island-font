<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>实验题管理</p>
        </div>
        <div class="header-right">
          <el-input
            class="search_input"
            v-model="searchKey"
            placeholder="输入题目名称筛选"
          >
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
          <el-button
            class="addExperiment"
            type="primary"
            icon="el-icon-plus"
            @click="toCreateOneExperiment"
            plain
            >添加实验</el-button
          >
        </div>
      </div>
      <div class="mainer">
        <el-table
          :data="
            tableData.filter(
              (data) =>
                !searchKey ||
                data.title.toLowerCase().includes(searchKey.toLowerCase())
            )
          "
          style="width: 100%"
        >
          <el-table-column prop="displayId" label="实验序号" width="180">
          </el-table-column>
          <el-table-column prop="title" label="实验名称" width="200">
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="100">
            <template v-slot="props">
              <el-tag v-show="props.row.difficulty === 1" type="success">简单</el-tag>
              <el-tag v-show="props.row.difficulty === 2" type="warning">中等</el-tag>
              <el-tag v-show="props.row.difficulty === 3" type="danger">困难</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="point" label="能力点数" width="100">
          </el-table-column>
          <el-table-column prop="status" label="是否可见" width="150">
            <template v-slot="props">
              <el-switch
                @change="handleStatusChanged(props.row.id, props.row.status)"
                v-model="props.row.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" min-width="250" label="操作">
            <template v-slot="props">
              <el-button
                v-show="props.editorId === userId"
                icon="el-icon-edit-outline"
                size="mini"
                type="primary"
                @click="handleModify(props.row.id)"
                plain
                >编辑</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-download"
                type="success"
                style="margin-left: 30px"
                @click="handleDownload(props.row.displayId)"
                plain
                >下载</el-button
              >
              <el-button
                v-show="props.editorId === userId"
                icon="el-icon-delete"
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
          @current-change="handlePageChanged"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { listExperimentForTeachers, statusChange, downloadSource } from "@/api/experiments";
export default {
  data() {
    return {
      userId: this.$store.state.id,
      searchKey: "",
      tableData: [],
      total: 0,
    };
  },
  methods: {
    toCreateOneExperiment() {
      this.$router.push({
        path: "/experiment/create",
      });
    },
    async handleStatusChanged(id, status) {
      try {
        await statusChange(id, status);
        this.$message.success("更改成功");
      } catch (error) {
        this.$message.error("更改失败");
      }
    },
    async handlePageChanged(val) {
      try {
        let res = await listExperimentForTeachers(val);
        this.tableData = res.data.rows;
        this.total = res.data.count;
      } catch (error) {
        this.$message.error("服务异常");
      }
    },
    async handleModify(id) {
      this.$router.push({
        path: '/experiment/create',
        query: {
          id
        }
      })
    },
    async handleDownload(id) {
      let res = await downloadSource(id);
      window.open(res.data, '_self');
    }
  },
  async created() {
    try {
      let res = await listExperimentForTeachers(1);
      this.tableData = res.data.rows;
      this.total = res.data.count;
    } catch (error) {
      this.$message.error("服务异常");
    }
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

.addExperiment {
  margin-left: 30px;
}

.mainer {
  padding: 10px 5px 40px 5px;
}

.footer {
  padding: 10px;
  border-top: 1px solid #dae1ed;
}
</style>