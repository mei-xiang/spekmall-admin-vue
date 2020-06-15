<!--
 * @Description: 留言管理
 -->

<template>
  <div>
    <main-page ref="mainPage"
               :height="tableMaxH"
               :hasSelection="false"
               @buttonClick="buttonClick"
               :options="options"></main-page>

    <el-dialog :title="dialogType === 1?'处理':'查看'"
               v-dialogDrag
               custom-class="two-col-dialog"
               @close="closeDialog"
               :visible.sync="isShowAddOrEdit">
      <!-- 新增 编辑 -->
      <main-form ref="mainForm"
                 :data="postData"
                 :form="formConfig"
                 :options="options"
                 :rules="rules"></main-form>
      <div class="footer text-center">
        <el-button v-if="dialogType !== 2"
                   type="primary"
                   @click="publish">确定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Msg",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/messages",
          params: null,
          records: 'data'
        },
        search: {
          mainConfigData: [
            {
              label: "类型",
              key: "msgType",
              type: 2,
              width: 120,
              optionCode: 'MSGTYPE'
            },
            {
              label: "读取状态",
              key: "isRead",
              type: 2,
              width: 120,
              optionCode: 'isRead'
            },
            {
              label: "处理情况",
              key: "handleStatus",
              type: 2,
              width: 120,
              optionCode: 'handleStatus'
            },
            {
              label: "咨询日期",
              key: "dateArr",
              type: 4,
              width: 130,
              isScope: true
            }
          ],
          searchData: {
            phone: "",
            companyName: ""
          }
        },
        theaderData: [
          {
            type: 0,
            width: 120,
            hasSort: false,
            isShow: true,
            prop: 'msgType',
            label: '类型',
            optionCode: 'MSGTYPE'
          },
          {
            type: 0,
            width: 0,
            hasSort: false,
            isShow: true,
            prop: 'companyName',
            label: '公司'
          },
          {
            type: 0,
            width: 120,
            hasSort: false,
            isShow: true,
            prop: 'phone',
            label: '手机'
          },
          {
            type: 0,
            width: 140,
            hasSort: false,
            isShow: true,
            prop: 'email',
            label: '邮箱'
          },
          {
            type: 0,
            width: 80,
            hasSort: false,
            isShow: true,
            prop: 'isRead',
            label: '读取情况',
            optionCode: 'isRead'
          },
          {
            type: 0,
            width: 80,
            hasSort: false,
            isShow: true,
            prop: 'handleStatus',
            label: '处理状态',
            optionCode: 'handleStatus'
          },

          {
            type: 8,
            width: 130,
            hasSort: false,
            isShow: true,
            prop: 'createTime',
            label: '咨询时间'
          },

          {
            type: 1,
            width: '220px',
            hasSort: false,
            isShow: () => {
              return this.$isPermission("msg")
            },
            btnList: [
              {
                label: "查看",
                fn: "detailBtn"
              },
              {
                label: "删除",
                fn: "delBtn"
              },
              {
                label: "处理",
                fn: "editBtn",
                hidden: (row) => {
                  if (!row.handleStatus) {
                    return true
                  } else {
                    return false
                  }
                }
              }
            ],
            label: '操作'
          },
          {
            type: 1,
            width: '200px',
            hasSort: false,
            isShow: () => {
              return !this.$isPermission("msg")
            },
            btnList: [
              {
                label: "查看",
                fn: "detailBtn"
              }
            ],
            label: '操作'
          }
        ]
      },
      options: {
        handleStatus: [
          { label: "未处理", id: false },
          { label: "已处理", id: true }
        ],
        isRead: [
          { label: "未读", id: false },
          { label: "已读", id: true }
        ]
      },
      postData: {
        id: null,
        msgType: null,
        companyName: null,
        phone: null,
        email: null,
        content: null,
        handleMan: null,
        handleContent: null
      },
      // 弹框相关
      isShowAddOrEdit: false,
      // 0 新增  1修改  2查看
      dialogType: 0,
      formConfig: [],
      rules: {
        handleContent: [
          this.$rules.setRequired("请输入处理内容"),
          this.$rules.setLength(1, 200)
        ],
        handleMan: [
          this.$rules.setRequired("请输入处理内容"),
          this.$rules.setLength(1, 10)
        ]

      }

    };
  },
  methods: {
    getOptions() {
      const codes = "MSGTYPE";
      this.axios.get("/api/dictionary/detail/childs/" + codes)
        .then((res) => {
          res.data.map((item) => {
            const element = item.details.map((subItem) => {
              return {
                id: subItem.value,
                label: subItem.text
              }
            })
            this.$set(this.options, item.code, element)
          })
          this.setPage()
        });
    },
    buttonClick(val, index, fn) {
      this[fn](val, index);
    },
    setPage() {
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    },
    // 右侧按钮列表部分 -------------------------
    getDataById(data) {
      return new Promise((resolve, reject) => {
        this.axios.get(`/api/messages/${data.id}`).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
      })
    },
    editBtn(data) {
      this.getDataById(data).then((res) => {
        this.dialogType = 1;
        for (const key in this.postData) {
          if (res.data.hasOwnProperty(key)) {
            this.postData[key] = res.data[key];
          }
        };
        this.setFrom(this.dialogType);
        this.isShowAddOrEdit = true;
      });
    },
    delBtn(data) {
      this.$delBtn(() => {
        this.axios.del(`/api/messages/${data.id}`).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
      })
    },
    detailBtn(data) {
      this.getDataById(data).then((res) => {
        this.dialogType = 2;
        for (const key in this.postData) {
          if (res.data.hasOwnProperty(key)) {
            this.postData[key] = res.data[key];
          }
        };
        this.setFrom(this.dialogType);
        this.isShowAddOrEdit = true;
      });
    },
    setFrom(type) {
      this.formConfig = [
        [
          {
            span: 24,
            labelWidth: "160px",
            list: [
              {
                type: "select",
                label: "内容类型：",
                prop: "msgType",
                optionCode: 'MSGTYPE',
                readOnly: true
              },
              {
                type: "text",
                label: "公司（个人）名称：",
                prop: "companyName",
                readOnly: true
              },
              {
                type: "text",
                label: "联系手机：",
                prop: "phone",
                readOnly: true
              },
              {
                type: "text",
                label: "联系邮箱：",
                prop: "email",
                readOnly: true
              },
              {
                type: "textarea",
                label: "咨询内容：",
                prop: "content",
                readOnly: true
              },
              {
                type: "text",
                label: "处理人：",
                prop: "handleMan",
                readOnly: type === 2
              },
              {
                type: "textarea",
                label: "处理内容：",
                prop: "handleContent",
                readOnly: type === 2
              }
            ]
          }
        ]
      ]
    },
    // 提交保存数据
    publish() {
      this.$refs["mainForm"].validate((data) => {
        console.log(data, "提交保存的数据")
        let fn = "post";
        let url = "/api/messages";
        if (this.dialogType === 1) {
          fn = "put";
          url = "/api/messages/" + data.id;
        }
        this.axios[fn](url, data).then((res) => {
          this.$message.success(res.msg);
          this.closeDialog();
          this.getList();
        });
      });
    },
    // 获取列表数据
    getList() {
      this.$refs.mainPage.getList()
    },
    closeDialog() {
      this.imageUrl = null;
      this.postData = this.$options.data.call(this).postData;
      if (this.dialogType !== 2) {
        // 关闭弹框初始化数据
        this.$refs.mainForm.clearValidate();
      }
      this.getList()
      this.isShowAddOrEdit = false;
    }
  },
  mounted() {
    this.getOptions();
  }
};
</script>
