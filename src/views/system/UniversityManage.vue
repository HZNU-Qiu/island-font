<template>
  <div class="container">
    <h1>院校管理</h1>
    <div class="header">
      <el-input
        class="search"
        placeholder="输入关键字筛选"
        v-model="filterText"
      ></el-input>
      <el-button
        class="addUniversity"
        type="success"
        @click="handleAddUniversity"
        icon="el-icon-office-building"
        plain
        >新增学校节点</el-button
      >
    </div>
    <el-tree
      class="filter-tree"
      :filter-node-method="filterNode"
      ref="tree"
      :data="data"
      node-key="id"
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
import {
  addUniversity,
  addSchool,
  addDepartment,
  addMajor,
  addClass,
  getTree,
  modifyUniversity,
  modifySchool,
  modifyDepartment,
  modifyMajor,
  modifyClass,
} from "@/api/System/universityManage";
export default {
  data() {
    return {
      filterText: "",
      data: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.handleRenderTree();
  },
  methods: {
    handleRenderTree() {
      getTree()
        .then((res) => {
          this.data = res.data;
        })
        .catch(() => {
          this.$message({
            type: "danger",
            message: "服务器故障",
          });
        });
    },
    handleAddUniversity() {
      this.$prompt("正在新增学校", "创建", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          addUniversity({ name: value })
            .then((res) => {
              this.data.push(res.data);
              this.$message({
                type: "success",
                message: "已新增学校:" + value,
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "添加失败",
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    append(data) {
      switch (data.rank) {
        case 1:
          this.$prompt('正在为"' + data.label + '"新增学院', "创建", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              addSchool({ name: value, universityId: data.selfId })
                .then((res) => {
                  if (!data.children) {
                    this.$set(data, "children", []);
                  }
                  data.children.push(res.data);
                  this.$message({
                    type: "success",
                    message: "已新增学院:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "添加失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 2:
          this.$prompt('正在为"' + data.label + '"新增系别', "创建", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              addDepartment({ name: value, schoolId: data.selfId })
                .then((res) => {
                  if (!data.children) {
                    this.$set(data, "children", []);
                  }
                  data.children.push(res.data);
                  this.$message({
                    type: "success",
                    message: "已新增系别:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "添加失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 3:
          this.$prompt('正在为"' + data.label + '"新增专业', "创建", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              addMajor({ name: value, departmentId: data.selfId })
                .then((res) => {
                  if (!data.children) {
                    this.$set(data, "children", []);
                  }
                  data.children.push(res.data);
                  this.$message({
                    type: "success",
                    message: "已新增专业:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "添加失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 4:
          this.$prompt('正在为"' + data.label + '"新增班级', "创建", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              addClass({ name: value, majorId: data.selfId })
                .then((res) => {
                  if (!data.children) {
                    this.$set(data, "children", []);
                  }
                  data.children.push(res.data);
                  this.$message({
                    type: "success",
                    message: "已新增班级:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "添加失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        default:
          this.$message({
            type: "warning",
            message: "系统故障",
          });
      }
    },
    modify(data) {
      switch (data.rank) {
        case 1:
          this.$prompt('正在修改"' + data.label + '"的名称', "编辑学校信息", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              modifyUniversity({ name: value, id: data.selfId })
                .then(() => {
                  data.label = value;
                  this.$message({
                    type: "success",
                    message: "已编辑学校名称:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "编辑失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 2:
          this.$prompt('正在修改"' + data.label + '"的名称', "编辑学院信息", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              modifySchool({ name: value, id: data.selfId })
                .then(() => {
                  data.label = value;
                  this.$message({
                    type: "success",
                    message: "已编辑学院名称:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "编辑失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 3:
          this.$prompt('正在修改"' + data.label + '"的名称', "编辑系别信息", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              modifyDepartment({ name: value, id: data.selfId })
                .then(() => {
                  data.label = value;
                  this.$message({
                    type: "success",
                    message: "已编辑系别名称:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "编辑失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 4:
          this.$prompt('正在修改"' + data.label + '"的名称', "编辑专业信息", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              modifyMajor({ name: value, id: data.selfId })
                .then(() => {
                  data.label = value;
                  this.$message({
                    type: "success",
                    message: "已编辑专业名称:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "编辑失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        case 5:
          this.$prompt('正在修改"' + data.label + '"的名称', "编辑班级信息", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
          })
            .then(({ value }) => {
              modifyClass({ name: value, id: data.selfId })
                .then(() => {
                  data.label = value;
                  this.$message({
                    type: "success",
                    message: "已编辑班级名称:" + value,
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "warning",
                    message: "编辑失败",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
          break;
        default:
          this.$message({
            type: "warning",
            message: "系统故障",
          });
      }
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      if (data.rank !== 5) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                plain
                on-click={() => this.modify(data)}
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-plus"
                circle
                plain
                on-click={() => this.append(data)}
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-close"
                circle
                plain
                on-click={() => this.remove(node, data)}
              ></el-button>
            </span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                plain
                on-click={() => this.modify(data)}
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-close"
                circle
                plain
                on-click={() => this.remove(node, data)}
              ></el-button>
            </span>
          </span>
        );
      }
    },
  },
};
</script>

<style>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
}
.el-tree-node__content {
  height: 40px;
  margin-top: 8px;
}
.custom-tree-node {
  padding: 4px 8px 4px 8px;
  border: 1px solid #b2bcc2;
  border-radius: 5px;
}
.el-tree {
  width: 600px;
}

.search {
  width: 300px;
  margin: 0 60px 10px 25px;
}

.addUniversity {
  margin-left: 70px;
}

h1 {
  color: #525353;
  margin-left: 25px;
}
</style>