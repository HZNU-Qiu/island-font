<template>
  <textarea ref="editor"></textarea>
</template>

<script>
import Simditor from "tar-simditor";
import "tar-simditor/styles/simditor.css";
import "tar-simditor-markdown";
import "tar-simditor-markdown/styles/simditor-markdown.css";
// import "./simditor-file-upload"
export default {
  name: "Editor",
  props: {
    toolbar: {
      type: Array,
      default: () => [
        "title",
        "bold",
        "italic",
        "underline",
        "fontScale",
        "color",
        "ol",
        "ul",
        "markdown",
        "|",
        "image",
        "link",
        "hr",
        "|",
        "indent",
        "outdent",
        "alignment",
      ],
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      currentValue: this.value,
    };
  },
  mounted() {
    this.editor = new Simditor({
      textarea: this.$refs.editor,
      toolbar: this.toolbar,
      upload: {
        url: "/web/common/uploadCourseImg", //文件上传的接口地址
        params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
        fileKey: "file", //服务器端获取文件数据的参数名
        connectionCount: 3,
        leaveConfirm: "正在上传文件",
      },
      pasteImage: true,
      markdown: false,
      allowedStyles: {
        span: ["color"],
      },
    });
    this.editor.on("valuechanged", (e, src) => {
      this.currentValue = this.editor.getValue();
    });
    this.editor.on("decorate", (e, src) => {
      this.currentValue = this.editor.getValue();
    });
    this.editor.setValue(this.value);
  },
  watch: {
    value(val) {
      if (this.currentValue !== val) {
        this.currentValue = val;
        this.editor.setValue(val);
      }
    },
    currentValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("change", newVal);
        this.$emit("input", newVal);
      }
    },
  },
};
</script>

<style scoped>
</style>