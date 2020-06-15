<!--
 * @Description: 新闻列表
 -->

<template>
  <div>
    <div class="main-page">
      <main-page ref="mainPage"
                 :height="tableMaxH"
                 @clickBtn="clickBtn"
                 @buttonClick="buttonClick"
                 @showMoreSearch="showMoreSearch"
                 :options="options"></main-page>

      <div class="sub-page"
           v-if="isShowSubPage">
        <el-scrollbar style="height:100%"
                      ref="scrollbar">
          <h4 class="main-title">新闻详情
            <a class="cursor-pointer"
               @click="closeSubPage">
              <i class="el-icon-error"></i>
            </a>
          </h4>
          <!-- 查看 -->
          <div v-if="dialogType === 2"
               class="detail-wrap">
            <h2 class="title">{{postData.title}}</h2>
            <p class="sub-title">
              <span>发布时间：</span>{{postData.publishTime}}
              <span>阅读量：</span>{{postData.readNum}}
            </p>
            <div class="text-wrap"
                 v-html="postData.content"></div>
          </div>
          <!-- 新增 编辑 -->
          <div v-else>
            <div class="form-wrap">
              <main-form ref="mainForm"
                         :data="postData"
                         :form="formConfig"
                         :options="options"
                         @homeChange="homeChange"
                         :rules="rules"></main-form>
              <div class="clearfix">
                <div class="avatar-wrap">
                  <span class="label">标题图片：</span>
                  <el-upload class="avatar-uploader"
                             :show-file-list="false"
                             :disabled="dialogType === 2"
                             action=""
                             :http-request="uploadImg"
                             :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl"
                         :src="imageUrl"
                         class="avatar">
                    <i v-else
                       class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <span class="help-txt">尺寸351×225，格式PNG/JPG/JPEG，大小10M以内</span>
                </div>
              </div>
              <h5>内容：</h5>
              <vue-ueditor-wrap v-model="postData.content"
                                :destroy="true"
                                :config="UEDITOR_CONFIG"></vue-ueditor-wrap>
              <div class="footer"
                   v-if="dialogType !== 2">
                <el-button type="primary"
                           @click="publish">确 定 发 布</el-button>
                <el-button @click="closeSubPage">取 消</el-button>
              </div>
            </div>

          </div>

        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import VueUeditorWrap from 'vue-ueditor-wrap';
import { getStore } from 'js/store'
export default {
  name: "News",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/news",
          params: null,
          records: 'data'
        },
        search: {
          mainConfigData: [
            {
              label: "类型",
              key: "newsType",
              type: 2,
              width: 100,
              optionCode: 'newsType'
            },
            {
              label: "标题",
              key: "title",
              type: 0,
              width: 120
            },
            {
              label: "发布状态",
              key: "status",
              type: 2,
              width: 100,
              optionCode: 'status'
            },
            {
              label: "发布日期",
              key: "publishTimeArr",
              type: 4,
              width: 130,
              isScope: true
            }
          ],
          subConfigData: [
            {
              label: "首页展示",
              key: "homeShow",
              type: 2,
              width: 120,
              optionCode: 'homeShow'
            },
            {
              label: "置顶",
              key: "top",
              type: 2,
              width: 120,
              optionCode: 'top'
            }
          ],
          searchData: {}
        },
        btnListData: [
          {
            label: "发布",
            icon: "el-icon-circle-plus-outline",
            fn: "addBtn",
            permission: 'news'
          },
          {
            label: "删除",
            icon: "el-icon-delete",
            fn: "delBtn",
            permission: 'news'
          }
        ],
        theaderData: [
          {
            type: 0,
            width: '100px',
            hasSort: false,
            isShow: true,
            prop: 'newsType',
            label: '类型',
            optionCode: "newsType"
          },
          {
            type: 0,
            width: 'none',
            hasSort: false,
            isShow: true,
            prop: 'title',
            label: '标题'
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
            width: '120px',
            hasSort: false,
            isShow: true,
            prop: 'publisher',
            label: '发布人'
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
            type: 0,
            width: '80px',
            hasSort: false,
            isShow: true,
            prop: 'readNum',
            label: '阅读量',
            optionCode: "readNum"
          },
          {
            type: 0,
            width: '80px',
            hasSort: false,
            isShow: true,
            prop: 'top',
            label: '置顶',
            optionCode: "top"
          },
          {
            type: 0,
            width: '120px',
            hasSort: false,
            isShow: true,
            prop: 'homeShow',
            label: '是否首页展示',
            optionCode: "homeShow"
          },
          {
            type: 0,
            width: '80px',
            hasSort: false,
            isShow: true,
            prop: 'orders',
            label: '首页排序'
          },
          {
            type: 1,
            width: '270px',
            hasSort: false,
            isShow: () => {
              return this.$isPermission("news")
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
                label: "编辑",
                fn: "editBtn",
                hidden: (row) => {
                  if (row.status !== 1) {
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
                  if (row.status === 1) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              {
                label: "置顶",
                fn: "topBtn",
                hidden: (row) => {
                  if (row.top === 0) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              {
                label: "取消置顶",
                fn: "cancelTopBtn",
                hidden: (row) => {
                  if (row.top === 1) {
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
              return !this.$isPermission("news")
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
        newsType: 1,
        status: 1,
        content: "",
        title: "",
        top: 0,
        homeShow: 0,
        picUrl: null,
        orders: null
      },
      // 副页面
      isShowSubPage: false,
      // 0 新增  1修改  2查看
      dialogType: 0,
      imageUrl: '',
      formConfig: [],
      rules: {
        title: [
          this.$rules.setRequired("请输入标题"),
          this.$rules.setLength(1, 30)
        ],
        orders: [
          this.$rules.checkInterNum(true)
        ]
      },
      options: {
        newsType: [
          { label: "企业新闻", id: 1 },
          { label: "行业新闻", id: 2 }
        ],
        top: [
          { label: "是", id: 1 },
          { label: "否", id: 0 }
        ],
        homeShow: [
          { label: "是", id: 1 },
          { label: "否", id: 0 }
        ],
        status: [
          { label: "已下架", id: 0 },
          { label: "已发布", id: 1 }
        ]
      },
      UEDITOR_CONFIG: {}
    }
  },
  components: {
    VueUeditorWrap
  },
  methods: {
    showMoreSearch() {
      this.$nextTick(() => {
        this.resetLayout()
      })
    },
    clickBtn(fn, data) {
      this[fn](data);
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
    homeChange([val]) {
      this.setFrom(val);
      if (val) {
        this.postData.orders = 1;
      } else {
        this.postData.orders = null;
      }
    },
    setFrom(homeshow) {
      this.formConfig = [
        [
          {
            span: 8,
            labelWidth: "100px",
            list: [
              {
                type: "select",
                label: "文章类型：",
                prop: "newsType",
                optionCode: 'newsType'
              },
              {
                type: "select",
                label: "首页新闻：",
                prop: "homeShow",
                optionCode: 'homeShow',
                changeFn: 'homeChange'
              }
            ]
          },
          {
            span: 8,
            labelWidth: "100px",
            list: [
              {
                type: "text",
                label: "文章标题：",
                prop: "title",
                maxLength: 40
              },
              {
                type: "text",
                label: "首页序号：",
                prop: "orders",
                hidden: !homeshow
              }
            ]
          }
        ]
      ]
    },
    uploadImg(data) {
      this.axios.upload([data.file]).then((res) => {
        this.postData.picUrl = res.data;
        this.imageUrl = URL.createObjectURL(data.file);
      })
    },
    addBtn() {
      this.dialogType = 0;
      this.setFrom(0);
      this.isShowSubPage = true;
    },
    getDataById(data) {
      return new Promise((resolve, reject) => {
        this.axios.get(`/api/news/${data.id}`).then((res) => {
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
        this.imageUrl = this.$imageSrc(res.data.picUrl);
        this.setFrom(res.data.homeShow);
        this.isShowSubPage = true;
      });
    },
    detailBtn(data) {
      this.getDataById(data).then((res) => {
        this.postData = res.data;
        this.dialogType = 2;
        this.isShowSubPage = true;
      });
    },

    changeStatus(id, status, type) {
      this.axios.put(`/api/news/${id}/${status}/${type}`).then((res) => {
        this.$message.success(res.msg);
        this.getList();
      })
    },
    pullOffBtn(data) {
      this.$delBtn(() => {
        this.changeStatus(data.id, 0, 'publish')
      }, "确定下架新闻？")
    },
    topBtn(data) {
      this.$delBtn(() => {
        this.changeStatus(data.id, 1, 'top')
      }, "确定置顶新闻？")
    },
    cancelTopBtn(data) {
      this.$delBtn(() => {
        this.changeStatus(data.id, 0, 'top')
      }, "确定取消置顶？")
    },
    delBtn(data) {
      let id = '';
      if (Array.isArray(data)) {
        if (this.$btnValidator(data, "请移除已发布的新闻后，再次删除", (item) => {
          if (item.status === 1) {
            return true
          } else {
            return false
          }
        })) return;
        id = this.$array.returnArrayByKey(data, "id").join(",");
      } else {
        id = data.id;
      }
      this.$delBtn(() => {
        this.axios.del(`/api/news/${id}`).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
        return false;
      }
      if (!isLt) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
        return false;
      }
      let _this = this;
      const fileReader = () => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (theFile) {
            resolve(theFile);
          }
        })
      }
      const imgReader = (theFile) => {
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.src = theFile.srcElement.result;
          img.onload = function () {
            let { width, height } = img;
            if (width !== 351 || height !== 225) {
              _this.$message.error(`图片尺寸为 宽${width}，高${height}，不符合尺寸要求！`);
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(false);
            } else {
              resolve(true);
            }
          }
        })
      }
      async function valdate(isJPG, isLt) {
        let theFile = await fileReader();
        let isSize = await imgReader(theFile);
        return isSize
      }
      return valdate();
    },
    // 提交保存数据
    publish() {
      this.$refs['scrollbar'].wrap.scrollTop = 0;
      this.$refs["mainForm"].validate((data) => {
        if (this.$dataIsNull(data.picUrl)) {
          this.$message.warning("请上传标题图片");
          return;
        }
        let fn = "post";
        let url = "/api/news";
        if (this.dialogType === 1) {
          fn = "put";
          url = "/api/news/" + data.id;
          data.status = 1;
          data.orders = data.orders === 0 ? null : data.orders;
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
  created() {
    this.UEDITOR_CONFIG = getStore({ name: 'UEDITOR_CONFIG' });
  },
  mounted() {
    this.setPage();
  }
};
</script>
<style scoped lang="stylus">
h5
  margin-left 30px
  line-height 40px

.form-wrap
  position relative
  height 245px

  .footer
    padding-top 32px
    text-align center

.avatar-wrap
  position relative
  float left
  width 423px

.label
  position relative
  top 28px
  left 20px
  font-size 12px

  &:before
    content '*'
    color #F56C6C
    margin-right 4px

>>>.avatar-uploader
  margin-left 100px

  .el-upload
    border 1px dashed #d9d9d9
    border-radius 6px
    cursor pointer
    position relative
    overflow hidden
    display inline-block

.avatar-uploader .el-upload:hover
  border-color #409EFF

.avatar-uploader-icon
  font-size 28px
  color #8c939d
  width 40px
  height 40px
  line-height 40px
  text-align center

.avatar
  width 40px
  height 40px
  display block

.help-txt
  position absolute
  top 20px
  left 150px
  font-size 12px

.detail-wrap
  padding 10px 50px

  .title
    line-height 40px
    text-align center
    font-size 30px

  .sub-title
    margin-bottom 30px
    line-height 30px
    border-bottom 1px solid #ccc
    text-align center

    span
      padding 10px

.text-wrap
  word-break break-all
  word-wrap break-word
</style>
