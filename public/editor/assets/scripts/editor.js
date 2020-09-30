const FixOffeset = 17;
const TOKEN = 'ÄcbdÊniÆÇÉÇÈÈjkgelÈ';
function unCompileParam(code = '') {
  let c = String.fromCharCode(code.charCodeAt(0) - FixOffeset - code.length);
  for (let i = 1; i < code.length; i += 1) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}

const token = unCompileParam(TOKEN);
const defaultPargh = { title: '示例文章', value: '', key: 'closertb' };

function getDefault () {
  return fetch('/editor/assets/default-content.md')
  .then(res => res.text());
}

const app = new Vue({
  el: '#app',
  data: function () {
    let d = {
      aboutOutput: '',
      output: '',
      source: '',
      loading: false,
      editorThemes: [
        { label: 'base16-light', value: 'base16-light' },
      ],
      editor: null,
      selectedItem: {},
      builtinFonts: [
        {
          label: '无衬线',
          value: "-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif"
        },
        {
          label: '衬线',
          value: "Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
        }
      ],
      sizeOption: [
        { label: '14px', value: '14px', desc: '稍小' },
        { label: '15px', value: '15px', desc: '默认' },
        { label: '16px', value: '16px', desc: '稍大' },
        { label: '17px', value: '17px', desc: '很大' },
      ],
      themeOption: [
        { label: 'default', value: 'default', author: '张凯强' },
      ],
      graphList: [defaultPargh],
      styleThemes: {
        default: defaultTheme,
      },
      aboutDialogVisible: false
    };
    d.currentEditorTheme = d.editorThemes[0].value;
    d.currentFont = d.builtinFonts[0].value;
    d.currentSize = d.sizeOption[1].value;
    d.currentTheme = d.themeOption[0].value;
    d.currentGraph = d.graphList[0].value;
    return d;
  },
  mounted() {
    const self = this;
    this.editor = CodeMirror.fromTextArea(
      document.getElementById('editor'),
      {
        lineNumbers: false,
        lineWrapping: true,
        styleActiveLine: true,
        theme: this.currentEditorTheme,
        mode: 'text/x-markdown',
      }
    );
    this.editor.on("change", function (cm, change) {
      self.refresh();
      self.saveEditorContent();
    });
    this.wxRenderer = new WxRenderer({
      theme: this.styleThemes.default,
      fonts: this.currentFont,
      size: this.currentSize,
      graph: this.currentGraph
    });
    // 如果有编辑内容被保存则读取，否则加载默认文档
    if (localStorage.getItem("__editor_content")) {
      this.editor.setValue(localStorage.getItem("__editor_content"));
    } else {
     /*  axios({
        url: './editor/assets/default-content.md',
        method: 'get'
      }).then(resp => {
        self.editor.setValue(resp.data)
      }); */
      getDefault()
      .then(data => {
        self.editor.setValue(data)
      });
    }
    fetch('https://closertb.site/arcticle/getListAll', {
      method: 'post',
      headers: {
        Authorization: `bearer ${token}`,
      }
    }).then(res => res.json()).then(function (resp) {
      if (resp.data) {
        const { repository: { issues: { totalCount, edges }}} = resp.data;
        self.graphList = [defaultPargh].concat(edges.map(({ cursor, node }) => {
          node.value = `${node.number}-|-${cursor}`;
          return node;
        }));
        return;
      }
      console.error('some error happend');
    });
  },
  methods: {
    renderWeChat: function (source) {
      let output = marked(source, { renderer: this.wxRenderer.getRenderer() });
      if (this.wxRenderer.hasFootnotes()) {
        // 去除第一行的 margin-top
        output = output.replace(/(style=".*?)"/, '$1;margin-top: 0"');
        // 引用注脚
        output += this.wxRenderer.buildFootnotes();
        // 附加的一些 style
        output += this.wxRenderer.buildAddition();
      }
      return output
    },
    clipData(key, extendText = '') {
      const item = this.selectedItem[key];
      if (!item) {
        return;
      }
      const text = document.createElement('textarea');
      text.id = 'temp-span';
      text.style.cssText = 'display: absolute; left: -1000px; z-index: -1;';
      text.value = item + extendText;

      document.body.appendChild(text);
      text.select();

      document.execCommand('Copy');

      this.$message({
        message: '已复制到剪贴板', type: 'success'
      });

      document.body.removeChild(text);
    },
    copyLink() {
      this.clipData('url');
    },
    copyTitle() {
      this.clipData('title');
    },
    copymd() {
      this.clipData('body', '\r\n![公众号：前端黑洞](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200607230314.png)');
    },
    refreshContent() {
      const params = this.selectedItem;
      $('#loading').show();
      fetch('https://closertb.site/arcticle/graphql', {
        method: 'post',
        headers: {
          Authorization: `bearer ${token}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'BlogDetailForEdit',
          query: `query BlogDetailForEdit($number: Int!) {
                    repository(owner: "closertb", name: "closertb.github.io") {
                      issue(number: $number) {
                        title
                        url
                        body
                        updatedAt
                      }
                    }
                  }`,
          variables: params
        })
      }).then(res => res.json()).then((resp) => {
        $('#loading').hide();
        if (resp.data) {
          const { repository: { issue: { body, title, url } } } = resp.data;
          this.selectedItem = Object.assign(this.selectedItem, { title, url, body });
          this.editor.setValue(body);
          return;
        }
        console.error('some error happend');
      }).catch(() => {
        $('#loading').hide();
      });
    },
    refreshList() {
      this.loading = true;
      fetch('https://closertb.site/arcticle/getListAll', {
        method: 'post',
        headers: {
          Authorization: `bearer ${token}`,
        }
      }).then(res => res.json()).then((resp) => {
        this.loading = false;
        if (resp.data) {
          const { repository: { issues: { totalCount, edges } } } = resp.data;
          this.graphList = [defaultPargh].concat(edges.map(({ cursor, node }) => {
            node.value = `${node.number}-|-${cursor}`;
            return node;
          }));
          return;
        }
        console.error('some error happend');
      });
    },
/*     editorThemeChanged: function (editorTheme) {
      this.editor.setOption('theme', editorTheme)
    }, */
    fontChanged: function (fonts) {
      this.wxRenderer.setOptions({
        fonts: fonts
      });
      this.refresh()
    },
    sizeChanged: function (size) {
      this.wxRenderer.setOptions({
        size: size
      });
      this.refresh()
    },
    graphChanged: function (graph) {
      const [number, cursor] = graph.split('-|-');
      const params = {
        number: +number,
        cursor
      };
      this.wxRenderer.setOptions({
        graph
      });
      if (!number) {
        getDefault()
        .then(data => {
          this.editor.setValue(data);
        });
        return;
      }
      this.selectedItem = params;
      this.refreshContent();
    },
/*     themeChanged: function (themeName) {
      let themeObject = this.styleThemes[themeName];
      this.wxRenderer.setOptions({
        theme: themeObject
      });
      this.refresh()
    }, */
    // 刷新右侧预览
    refresh: function () {
      this.output = this.renderWeChat(this.editor.getValue(0))
    },
    // 将左侧编辑器内容保存到 LocalStorage
    saveEditorContent: function () {
      let content = this.editor.getValue(0);
      if (content){
        localStorage.setItem("__editor_content", content);
      } else {
        localStorage.removeItem("__editor_content");
      }
    },
    copy: function () {
      let clipboardDiv = document.getElementById('output');
      clipboardDiv.focus();
      window.getSelection().removeAllRanges();
      let range = document.createRange();
      range.setStartBefore(clipboardDiv.firstChild);
      range.setEndAfter(clipboardDiv.lastChild);
      window.getSelection().addRange(range);

      try {
        if (document.execCommand('copy')) {
          this.$message({
            message: '已复制到剪贴板', type: 'success'
          })
        } else {
          this.$message({
            message: '未能复制到剪贴板，请全选后右键复制', type: 'warning'
          })
        }
      } catch (err) {
        this.$message({
          message: '未能复制到剪贴板，请全选后右键复制', type: 'warning'
        })
      }
    },
    openWindow: function (url) {
      window.open(url);
    }
  },
  updated: function () {
    this.$nextTick(function () {
      prettyPrint()
    })
  }
});
