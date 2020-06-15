<!--
 * @Description: banner
 -->

<template>
  <div>
    <main-page ref="mainPage"
               :height="tableMaxH"
               :hasSelection="false"
               :isShowPagination="false"
               @clickBtn="clickBtn"
               @buttonClick="buttonClick"></main-page>
    <!-- 新增，修改弹框 -->
    <el-dialog :title="dialogType === 0?'新增':'修改'"
               v-dialogDrag
               @close="closeDialog"
               :visible.sync="isShowAddOrEdit">
      <div class="avatar-wrap">
        <span class="label">图片：</span>
        <el-upload class="avatar-uploader"
                   :show-file-list="false"
                   action=""
                   :http-request="uploadImg"
                   :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl"
               :src="imageUrl"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="help-txt">尺寸1920×600，格式PNG/JPG/JPEG，大小10M以内</span>
      </div>

      <main-form ref="mainForm"
                 :data="postData"
                 :form="formConfig"
                 :rules="addOrEditRules"></main-form>
      <div slot="footer">
        <el-button type="primary"
                   @click="submit(dialogType)">确 定</el-button>
        <el-button @click="closeAddOrEdit">取 消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: "Banner",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/banners",
          params: {
            pageNum: 1,
            pageSize: 99999
          },
          records: 'data'
        },
        btnListData: [
          {
            label: "新增",
            icon: "el-icon-circle-plus-outline",
            fn: "addBtn",
            permission: 'news'
          }
        ],
        theaderData: [
          {
            type: 0,
            width: '300px',
            hasSort: false,
            isShow: true,
            prop: 'bannerName',
            label: '名称'
          },
          {
            type: 13,
            width: '150px',
            hasSort: false,
            isShow: true,
            prop: 'bannerPath',
            label: 'banner图片'
          },
          {
            type: 0,
            width: 'none',
            hasSort: false,
            isShow: true,
            prop: 'linkUrl',
            label: '链接地址'
          },
          {
            type: 1,
            width: '270px',
            hasSort: false,
            isShow: () => {
              return this.$isPermission("banner")
            },
            btnList: [
              {
                label: "编辑",
                fn: "editBtn"
              },
              {
                label: "删除",
                fn: "delBtn"
              },

              {
                label: "上移",
                fn: "topBtn",
                hidden: (row, allData, index) => {
                  if (index + 1 !== 1) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              {
                label: "下移",
                fn: "btmBtn",
                hidden: (row, allData, index) => {
                  if (index + 1 !== allData.length) {
                    return true
                  } else {
                    return false
                  }
                }
              }

            ],
            label: '操作'
          }

        ],
        isShowPagination: false,
        pageSize: 999999
      },
      postData: {
        id: null,
        bannerName: "首页",
        linkUrl: "",
        bannerPath: "",
        bannerType: "首页"
      },
      // 弹框相关
      isShowAddOrEdit: false,
      dialogType: 0,
      imageUrl: '',
      formConfig: [
        [
          {
            span: 24,
            labelWidth: "100px",
            list: [
              {
                type: "text",
                label: "名称：",
                prop: "bannerName"
              },
              {
                type: "text",
                label: "链接地址：",
                prop: "linkUrl",
                maxLength: 40
              }

            ]
          }
        ]
      ],
      addOrEditRules: {
        bannerName: [
          this.$rules.setRequired("请输入名称"),
          this.$rules.setLength(1, 20)
        ],
        linkUrl: [
          this.$rules.setLength(1, 40)
        ]
      }
    };
  },
  methods: {
    // 获取列表数据
    getList() {
      this.$refs.mainPage.getList()
    },
    setPage() {
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    },
    clickBtn(fn) {
      this[fn]();
    },
    buttonClick(val, index, fn, allData) {
      this[fn](val, index, allData);
    },
    addBtn() {
      this.dialogType = 0;
      this.isShowAddOrEdit = true;
    },
    delBtn(data) {
      this.$delBtn(() => {
        this.axios.del(`/api/banners/${data.id}`).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
      })
    },
    // 右侧按钮列表部分 -------------------------
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
            if (width !== 1920 || height !== 600) {
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
    uploadImg(data) {
      this.axios.upload([data.file]).then((res) => {
        this.postData.bannerPath = res.data;
        this.imageUrl = URL.createObjectURL(data.file);
      })
    },
    getDataById(data) {
      return new Promise((resolve, reject) => {
        this.axios.get(`/api/banners/${data.id}`).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
      })
    },
    editBtn(data) {
      this.getDataById(data).then((res) => {
        for (const key in this.postData) {
          if (res.data.hasOwnProperty(key)) {
            this.postData[key] = res.data[key];
          }
        };
        this.imageUrl = this.$imageSrc(res.data.bannerPath);
        this.dialogType = 1;
        this.isShowAddOrEdit = true;
      });
    },
    // 提交保存数据
    submit(dialogType) {
      let fn = "";
      let url = "";
      switch (dialogType) {
        case 0:
          fn = "post";
          url = "/api/banners";
          break;
        case 1:
          fn = "put";
          url = `/api/banners/${this.postData.id}`;
          break;
        default:
          break;
      }
      this.$refs["mainForm"].validate((data) => {
        // 新增修改的时候验证头像
        if (this.$dataIsNull(data.bannerPath)) {
          this.$message.warning("请上传头像");
          return;
        }
        this.axios[fn](url, data).then((res) => {
          this.$message.success(res.msg);
          this.closeAddOrEdit();
          this.getList();
        });
      });
    },
    closeAddOrEdit() {
      this.isShowAddOrEdit = false;
    },
    closeDialog() {
      this.imageUrl = null;
      // 关闭弹框初始化数据
      this.postData = this.$options.data.call(this).postData;
      this.$nextTick(() => {
        this.$refs.mainForm.clearValidate();
      })
    },
    changeStatus(data) {
      this.axios.put('/api/banners/sort', data, 'json').then((res) => {
        this.$message.success(res.msg);
        this.getList();
      })
    },
    topBtn(data, index, allData) {
      this.$delBtn(() => {
        let top = allData[index];
        let btm = allData[index - 1];
        allData.splice(index - 1, 2, top, btm);
        const postData = allData.map((item, index) => {
          return {
            id: item.id,
            orders: index + 1
          }
        })
        this.changeStatus(postData)
      }, "确定上移？")
    },
    btmBtn(data, index, allData) {
      this.$delBtn(() => {
        let top = allData[index];
        let btm = allData[index + 1];
        allData.splice(index, 2, btm, top);
        const postData = allData.map((item, index) => {
          return {
            id: item.id,
            orders: index + 1
          }
        })
        this.changeStatus(postData)
      }, "确定下移？")
    }
  },
  mounted() {
    this.setPage()
  }

};
</script>
<style scoped lang="stylus">
.avatar-wrap
  position relative
  width 380px
  height 67px

.label
  position relative
  top 28px
  left 43px
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
</style>
