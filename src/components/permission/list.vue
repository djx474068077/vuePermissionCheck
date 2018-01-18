<template>
  <div class="permission-list">
    <Row>
      <Col span="24">
      <Card style="width: 100%;margin: 0 auto;padding: 20px;border: 1px solid #ccc;">
        <h2 slot="title">
          权限管理
        </h2>
        <Button slot="extra" type="primary" @click.stop.prevent="addModal = true" style="font-size: 14px;margin: 15px 20px 0 0;">
          <Icon type="plus-round" size="16"></Icon>
          新增权限
        </Button>
        <Table stripe :columns="columns" :data="permission" size="small" ref="table" style="min-height: 600px"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;text-align: center">
            <Page :current="pages.Page" :total="pages.Count" :page-size="10" @on-change="listPermission"></Page>
          </div>
        </div>
      </Card>
      </Col>

    </Row>

    <Modal v-model="addModal"
           title="新增权限"
           ok-text="确定"
           cancel-text="取消"
           @on-ok="addPermiss">
      <div class="modal-cont">
        <p style="margin: 10px 0;">
          <span>name:</span>
          <Input v-model="addPermission.Name" placeholder="Enter something..." style="width: 300px"></Input>
        </p>
        <p style="margin: 10px 0;">
          <span>Slug:</span>
          <Input v-model="addPermission.Slug" placeholder="Enter something..." style="width: 300px"></Input>
          <Tooltip v-if="regAddSlug" class="input-msg" placement="right">
            <Icon type="information-circled" size="20" color="#ff0000"></Icon>
            <div slot="content">
            <p>Slug只能由  数组  字母 .  *   组成</p>
            </div>
          </Tooltip>
        </p>
        <p style="margin: 10px 0;">
          <span>请求方式:</span>
          <Select v-model="addPermission.HttpMethod" style="width: 300px;text-align: left">
            <Option value="GET" >GET</Option>
            <Option value="POST" >POST</Option>
          </Select>
        </p>
        <p style="margin: 10px 0;">
          <span>路径:</span>
          <Input v-model="addPermission.HttpPath" placeholder="Enter something..." style="width: 300px"></Input>
        </p>
      </div>
    </Modal>
    <Modal v-model="editModal"
           title="修改权限"
           ok-text="确定"
           cancel-text="取消"
           @on-ok="editPermiss">
      <div class="modal-cont" >
        <p style="margin: 10px 0;">
          <span>name:</span>
          <Input v-model="editPermission.Name" placeholder="Enter something..." style="width: 300px"></Input>
        </p>
        <p style="margin: 10px 0;">
          <span>Slug:</span>
          <Input v-model="editPermission.Slug" placeholder="Enter something..." style="width: 300px"></Input>
          <Tooltip v-if="regEditSlug" class="input-msg" placement="right">
            <Icon type="information-circled" size="20" color="#ff0000"></Icon>
            <div slot="content">
            <p>Slug只能由  数组  字母 .  *   组成</p>
            </div>
          </Tooltip>
        </p>
        <p style="margin: 10px 0;">
          <span>请求方式:</span>
          <Select v-model="editPermission.HttpMethod" style="width: 300px;text-align: left">
            <Option value="GET" >GET</Option>
            <Option value="POST" >POST</Option>
          </Select>
        </p>
        <p style="margin: 10px 0;">
          <span>路径:</span>
          <Input v-model="editPermission.HttpPath" placeholder="Enter something..." style="width: 300px"></Input>
        </p>
      </div>
    </Modal>

  </div>
</template>

<script >
  import {formatDate} from '../service/date.js'
  import qs from 'qs'
  export default {
    created () {
      this.listPermission(this.pages.page)
    },
    data () {
      return {
        addModal: false,
        editModal: false,
        pages: {
          Page: 1,
          Count: 0
        },

        permission: [],
        addPermission: {
          Name: '',
          Slug: '',
          HttpMethod: '',
          HttpPath: ''
        },
        editPermission: {
          ID: '',
          Name: '',
          Slug: '',
          HttpMethod: '',
          HttpPath: ''
        },
        columns: [
          {
            title: '编号',
            key: 'ID',
            width: 60
          },
          {
            title: 'Name',
            key: 'Name'
          },
          {
            title: 'Slug',
            key: 'Slug'

          },
          {
            title: '更新时间',
            key: 'UpdatedAt',
            render: (h, params) => {
              let time = this.permission[params.index].UpdatedAt.replace('+08:00', ' ').replace('T', ' ').replace("Z", " ")
              return [
                h('div', time)
              ]
            }
          },
          {
            title: '请求方式',
            key: 'HttpMethod'
          },
          {
            title: '路径',
            key: 'HttpPath'
          },
          {
            title: '操作',
            width: 240,
            render: (h, params) => {
              return [
                h('Button', {
                  attrs: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editPermission.ID = this.permission[params.index].ID
                      this.editPermission.Name = this.permission[params.index].Name
                      this.editPermission.Slug = this.permission[params.index].Slug
                      this.editPermission.HttpMethod = this.permission[params.index].HttpMethod
                      this.editPermission.HttpPath = this.permission[params.index].HttpPath
                      this.editModal = true
                    }
                  }
                }, '编辑'),
                h('Button', {
                  attrs: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deletePermission(this.permission[params.index].ID)
                    }
                  }
                }, '删除')
              ]
            }
          }
        ]
      }
    },
    computed: {
      regAddSlug () {
        let addRs = this.addPermission.Slug.match(/^[A-Za-z0-9.*]+$/)
        if (this.addPermission.Slug == ''){
          return false
        } else {
          return addRs == null
        }
      },
      regEditSlug () {
        let editRs = this.editPermission.Slug.match(/^[A-Za-z0-9.*]+$/)
        return editRs == null
      }
    },
    methods: {
      listPermission (page) {
        this.$http.get('/api/permission/list?p=' + page).then((response) => {
          let res = response.data
          console.log(res)

          if (res.status === 10000) {
            this.permission = res.Data
            this.pages.Page = res.Page
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      deletePermission (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/permission/delete', qs.stringify({
              ID: index
            })).then((response) => {
              let res = response.data
              console.log(res)
              if (res.status === 10000) {
                this.listPermission(this.pages.page)
                this.$Message.success('删除成功!')
              } else {
                this.$Message.error(res.message)
              }
            }).catch(() => {
              this.$Message.error('通讯错误，请重试')
            })
          },
          onCancel: () => {
          }
        })
      },
      addPermiss () {
        this.$http.post('/api/permission/save', qs.stringify({
          Name: this.addPermission.Name,
          Slug: this.addPermission.Slug,
          HttpPath: this.addPermission.HttpPath,
          HttpMethod: this.addPermission.HttpMethod
        })).then((response) => {
          let res = response.data
          if(res.status === 10000) {
            this.$Message.success('新增成功！')
            this.listPermission(this.pages.page)
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      editPermiss () {
        this.$http.post('/api/permission/save', qs.stringify({
          ID: this.editPermission.ID,
          Name: this.editPermission.Name,
          Slug: this.editPermission.Slug,
          HttpPath: this.editPermission.HttpPath,
          HttpMethod: this.editPermission.HttpMethod
        })).then((response) => {
          let res = response.data
          if(res.status === 10000) {
            this.$Message.success('修改成功！')
            this.listPermission(1)
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      }
    },
    filters: {
      formatDate (time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style>
.modal-cont{
  width: 90%;
  margin: 0 auto;
}
.modal-cont>p{
  margin: 10px 0;
  position: relative;
}
.modal-cont>p>span{
  display: inline-block;
  width: 60px;
  margin-right: 10px;
  float: left;
  line-height: 32px;
  font-size: 14px;
  text-align: right;
}
.modal-cont .input-msg{
  position: absolute;
  top: 9px;
  right: 40px;
}
</style>
