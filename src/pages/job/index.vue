<!--
 * @Description: 招聘
 -->

<template>
  <div>
    <div class="main-page">
      <main-page ref="mainPage"
                 :height="tableMaxH"
                 :hasSelection="false"
                 @clickBtn="clickBtn"
                 @buttonClick="buttonClick"
                 :options="options"></main-page>

      <div class="sub-page"
           v-if="isShowSubPage">
        <el-scrollbar style="height:100%"
                      ref="scrollbar">
          <h4 class="main-title">工作详情
            <a class="cursor-pointer"
               @click="closeSubPage">
              <i class="el-icon-error"></i>
            </a>
          </h4>

          <!-- 新增 编辑 -->
          <main-form ref="mainForm"
                     :data="postData"
                     :form="formConfig"
                     :options="options"
                     :rules="rules"></main-form>
          <div class="footer">
            <el-button v-if="dialogType !== 2"
                       type="primary"
                       @click="publish">确 定 发 布</el-button>
            <el-button @click="closeSubPage">取 消</el-button>
          </div>

        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Job",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/jobs",
          params: null,
          records: 'data'
        },
        search: {
          mainConfigData: [
            {
              label: '工作地点',
              key: "address",
              type: 0,
              width: 120
            },
            {
              label: "职业类型",
              key: "jobType",
              type: 2,
              width: 120,
              optionCode: 'jobType'
            },
            {
              label: "发布日期",
              key: "publishTimeArr",
              type: 4,
              width: 130,
              isScope: true
            }
          ]
        },
        btnListData: [
          {
            label: "发布",
            icon: "el-icon-circle-plus-outline",
            gridSelectModel: 2,
            fn: "addBtn",
            permission: 'job'
          }
        ],
        theaderData: [
          {
            type: 0,
            width: '100px',
            hasSort: false,
            isShow: true,
            prop: 'address',
            label: '工作地点'
          },
          {
            type: 0,
            width: '120px',
            hasSort: false,
            isShow: true,
            prop: 'jobType',
            label: '职业类别',
            optionCode: 'jobType'
          },
          {
            type: 0,
            width: 'none',
            hasSort: false,
            isShow: true,
            prop: 'jobName',
            label: '岗位名称'
          },
          {
            type: 0,
            width: '120px',
            hasSort: false,
            isShow: true,
            prop: 'recruitNum',
            label: '人数'
          },
          {
            type: 8,
            width: '140px',
            hasSort: false,
            isShow: true,
            prop: 'publishTime',
            label: '发布时间'
          },
          {
            type: 0,
            width: '80px',
            hasSort: false,
            isShow: true,
            prop: 'status',
            label: '状态',
            optionCode: "status"
          },
          {
            type: 1,
            width: '270px',
            hasSort: false,
            isShow: () => {
              return this.$isPermission("job")
            },
            btnList: [
              {
                label: "查看",
                fn: "detailBtn"
              },
              {
                label: "编辑",
                fn: "editBtn",
                hidden: (row) => {
                  if (row.status === false) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              {
                label: "删除",
                fn: "delBtn",
                hidden: (row) => {
                  if (row.status === false) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              {
                label: "下架",
                fn: "pullOffBtn",
                hidden: (row) => {
                  if (row.status === true) {
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
              return !this.$isPermission("job")
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
      postData: {
        id: null,
        jobCategory: '',
        address: '',
        education: '',
        recruitNum: null,
        jobName: '',
        workingYears: '',
        jobType: 1,
        salary: '',
        jobDesc: '',
        jobRequire: '',
        status: 1
      },
      // 副页面
      isShowSubPage: false,
      // 0 新增  1修改  2查看
      dialogType: 0,
      formConfig: [],
      rules: {
        jobCategory: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        address: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        education: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        jobName: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        workingYears: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        salary: [this.$rules.setRequired("请输入"), this.$rules.setLength(1, 20)],
        recruitNum: [
          this.$rules.checkInterNum(true)
        ]
      },
      options: {
        jobType: [
          { label: "全职", id: 1 },
          { label: "兼职", id: 2 },
          { label: "团队顾问", id: 3 }
        ],
        status: [
          { label: "已下架", id: 0 },
          { label: "已发布", id: 1 }
        ]
      }

    }
  },

  methods: {
    getOptions() {
      const codes = "DEGREE";
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
        });
    },
    clickBtn(fn) {
      this[fn]();
    },
    buttonClick(val, index, fn) {
      this[fn](val, index);
    },
    setPage() {
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    },
    // 获取列表数据
    getList() {
      this.$refs.mainPage.getList()
    },
    // 右侧按钮列表部分 -------------------------
    setFrom(type) {
      this.formConfig = [
        [
          {
            span: 8,
            labelWidth: "100px",
            list: [
              {
                type: "text",
                label: "职业类别：",
                prop: "jobCategory",
                readOnly: type === 2
              },
              {
                type: "text",
                label: "工作地点：",
                prop: "address",
                readOnly: type === 2
              },
              {
                type: "select",
                label: "学历要求：",
                prop: "education",
                readOnly: type === 2,
                optionCode: 'DEGREE'
              },
              {
                type: "text",
                label: "招聘人数：",
                prop: "recruitNum",
                readOnly: type === 2
              }
            ]
          },
          {
            span: 8,
            labelWidth: "100px",
            list: [
              {
                type: "text",
                label: "岗位名称：",
                prop: "jobName",
                maxLength: 40,
                readOnly: type === 2
              },
              {
                type: "text",
                label: "工作经验：",
                prop: "workingYears",
                placeholder: '例如：1、1 ~ 3年',
                readOnly: type === 2
              },
              {
                type: "select",
                label: "工作性质：",
                prop: "jobType",
                optionCode: 'jobType',
                readOnly: type === 2
              },
              {
                type: "text",
                label: "薪资待遇：",
                prop: "salary",
                placeholder: '例如：10K ~ 15k/月',
                readOnly: type === 2
              }
            ]
          }
        ],
        [
          {
            span: 20,
            labelWidth: "100px",
            list: [
              {
                type: "textarea",
                label: "岗位职责：",
                prop: "jobDesc",
                rows: 6,
                maxLength: 600,
                readOnly: type === 2
              },
              {
                type: "textarea",
                label: "任职资格：",
                prop: "jobRequire",
                rows: 6,
                maxLength: 600,
                readOnly: type === 2
              }
            ]
          }
        ]
      ]
    },

    addBtn() {
      this.dialogType = 0;
      this.setFrom(this.dialogType);
      this.isShowSubPage = true;
    },
    getDataById(data) {
      return new Promise((resolve, reject) => {
        this.axios.get(`/api/jobs/${data.id}`).then((res) => {
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
        this.isShowSubPage = true;
      });
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
        this.isShowSubPage = true;
      });
    },
    changeStatus(id, status) {
      this.axios.put(`/api/jobs/${id}/${status}`).then((res) => {
        this.$message.success(res.msg);
        this.getList();
      })
    },
    pullOffBtn(data) {
      this.$delBtn(() => {
        this.changeStatus(data.id, 0)
      }, "确定下架？")
    },
    delBtn(data) {
      this.$delBtn(() => {
        this.axios.del(`/api/jobs/${data.id}`).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
      })
    },

    // 提交保存数据
    publish() {
      this.$refs['scrollbar'].wrap.scrollTop = 0;
      this.$refs["mainForm"].validate((data) => {
        let fn = "post";
        let url = "/api/jobs";
        if (this.dialogType === 1) {
          fn = "put";
          url = "/api/jobs/" + data.id;
          data.status = 1;
        }

        this.axios[fn](url, data).then((res) => {
          this.$message.success(res.msg);
          this.closeSubPage();
          this.getList();
        });
      });
    },
    closeSubPage() {
      this.imageUrl = null;
      this.postData = this.$options.data.call(this).postData;
      if (this.dialogType !== 2) {
        // 关闭弹框初始化数据
        this.$refs.mainForm.clearValidate();
      }
      this.isShowSubPage = false;
    }

  },
  mounted() {
    this.setPage();
    this.getOptions();
  }
};
</script>
<style scoped lang="stylus">
h5
  margin-left 30px
  line-height 40px

.footer
  padding-top 32px
  text-align center
</style>
