<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>课程列表</p>
        </div>
        <div class="header-right">
          <el-input
            class="search_input"
            v-model="searchKey"
            placeholder="输入课程名称筛选"
          >
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
        </div>
      </div>
      <div class="main">
        <el-table
          :data="
            courses.filter(
              (data) =>
                !searchKey ||
                data.name.toLowerCase().includes(searchKey.toLowerCase())
            )
          "
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <div class="details">
                <el-form label-position="top" inline class="table-expand">
                  <el-form-item label="课程描述:">
                    <div v-if="!props.row.editFlag" class="table-edit">
                      <div>{{ props.row.description }}</div>
                    </div>
                    <div v-else class="table-edit">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2 }"
                        v-model="props.row.description"
                        placeholder
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="课程须知:">
                    <div v-if="!props.row.editFlag" class="table-edit">
                      <div>{{ props.row.notice }}</div>
                    </div>
                    <div v-else class="table-edit">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2 }"
                        v-model="props.row.notice"
                        placeholder
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="课程目标:">
                    <div v-if="!props.row.editFlag" class="table-edit">
                      <div>{{ props.row.objectives }}</div>
                    </div>
                    <div v-else class="table-edit">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2 }"
                        v-model="props.row.objectives"
                        placeholder
                      ></el-input>
                    </div>
                  </el-form-item>

                  <el-button
                    v-if="!props.row.editFlag"
                    type="info"
                    style="width: 150px"
                    plain
                    @click="handleModify(props.row)"
                    >修改课程信息</el-button
                  >
                  <el-row v-else :gutter="10">
                    <el-col :span="2">
                      <el-button
                        type="success"
                        icon="el-icon-check"
                        plain
                        circle
                        @click="handleSave(props.row)"
                      ></el-button>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="primary"
                        icon="el-icon-close"
                        plain
                        circle
                        @click="handleCancel(props.row)"
                      ></el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column
            label="综合评分"
            :show-overflow-tooltip="true"
            prop="point"
            width="150"
          >
            <template v-slot="props">
              <div v-if="props.row.point !== 0" class="content">
                {{ props.row.point }}
              </div>
              <div v-else>
                <el-tag type="warning">暂无评分</el-tag>
              </div>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column label="课程名称" width="300" prop="name">
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content">{{ props.row.name }}</div>
              </div>
              <div v-else class="table-edit">
                <el-input v-model="props.row.name" placeholder></el-input>
              </div>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column label="课程难度" prop="difficulty" width="100">
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content">
                  {{ difficultyTag[props.row.difficulty - 1] }}
                </div>
              </div>
              <div v-else class="table-edit">
                <el-select v-model="props.row.difficulty" placeholder>
                  <el-option label="简单" :value="1"></el-option>
                  <el-option label="中等" :value="2"></el-option>
                  <el-option label="困难" :value="3"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column label="方向/类别" prop="difficulty" width="200">
            <template v-slot="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content">
                  {{ props.row.directionName }} / {{ props.row.categoryName }}
                </div>
              </div>
              <div v-else class="table-edit">
                <el-cascader
                  :options="optionData"
                  :key="cascaderKey"
                  v-model="props.row.optionValue"
                  class="cascader"
                  clearable
                  @change="handleChange"
                ></el-cascader>
              </div>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column min-width="100" prop="status" label="启用/禁用">
            <template v-slot="props">
              <el-tag :type="props.row.status === 1 ? 'success' : 'warning'">{{
                props.row.status === 1 ? "启用" : "禁用"
              }}</el-tag>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column fixed="right" min-width="250" label="操作">
            <template v-slot="props">
              <el-button
                @click="showDetails(props.row)"
                size="mini"
                type="primary"
                plain
              >
                详情</el-button
              >
              <el-button size="mini" type="danger" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import CourseCard from "@/components/CourseCard/index";
import { listByTeacherId, modifyCourse } from "@/api/Teacher/courseManage";
import { getTree } from "@/api/System/courseDirection";

export default {
  components: {
    CourseCard,
  },
  data() {
    return {
      searchKey: "",
      optionData: [],
      optionValue: [],
      cascaderKey: 1,
      difficultyTag: ["简单", "中等", "困难"],
      courses: [],
      oldData: {
        categoryName: "",
        category_id: "",
        description: "",
        difficulty: "",
        directionName: "",
        direction_id: "",
        editFlag: "",
        id: "",
        name: "",
        notice: "",
        objectives: "",
        optionValue: [],
        point: "",
        status: "",
      },
    };
  },
  watch: {
    optionData() {
      ++this.cascaderKey;
    },
  },
  methods: {
    showDetails(row) {
      this.$router.push({
        path: "/courseDetail",
        query: {
          id: row.id,
        },
      });
    },
    handleChange(value) {
      this.optionValue = value;
    },
    handleCancel(row) {
      row.categoryName = this.oldData.categoryName;
      row.category_id = this.oldData.category_id;
      row.description = this.oldData.description;
      row.difficulty = this.oldData.difficulty;
      row.directionName = this.oldData.directionName;
      row.direction_id = this.oldData.direction_id;
      row.id = this.oldData.id;
      row.name = this.oldData.name;
      row.notice = this.oldData.notice;
      row.objectives = this.oldData.objectives;
      row.optionValue = this.oldData.optionValue;
      row.point = this.oldData.point;
      row.status = this.oldData.status;
      row.editFlag = false;
      this.$message({
        type: "info",
        message: "取消编辑",
      });
    },
    async handleModify(row) {
      try {
        let res = await getTree();
        this.oldData = { ...row };
        this.optionData = res.data;
        row.editFlag = !row.editFlag;
      } catch (error) {}
    },
    async handleSave(row) {
      let formData = {};
      formData = { ...row };
      delete formData.editFlag;
      let valid = this._preSubmit(formData);
      if (valid) {
        try {
          await modifyCourse(formData);
          row.editFlag = false;
          this.$message({
            type: "success",
            message: "保存成功",
          });
          let res = await listByTeacherId();
          this.courses = res.data;
        } catch (error) {
          this.$message({
            type: "warning",
            message: "系统故障",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "编辑信息不能含有空值",
        });
      }
    },
    // 编辑保存前的校验与数据封装
    _preSubmit(data) {
      let values = [];
      let flag = 1;
      values = Object.values(data);
      values.some((items) => {
        if (items === "" || items === null) {
          flag = 0;
          return true;
        }
      });
      if (!flag) {
        return false;
      } else {
        return true;
      }
    },
  },
  async created() {
    try {
      let res = await listByTeacherId();
      this.courses = res.data;
    } catch (error) {
      this.$message({
        type: "warning",
        message: "服务器异常",
      });
    }
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

.main {
  padding: 20px;
}

.table-expand {
  font-size: 0;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.table-edit > div {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>