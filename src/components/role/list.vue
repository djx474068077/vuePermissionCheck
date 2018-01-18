<template>
  <div class="role-list">
    <Row>
      <Col span="24">
      <Card style="width: 100%;margin: 0 auto;padding: 20px;border: 1px solid #ccc;">
        <h2 slot="title">
          角色管理
        </h2>
        <Button slot="extra" type="primary" @click.stop.prevent="editModal = true" style="font-size: 14px;margin: 15px 20px 0 0;">
          <Icon type="plus-round" size="16"></Icon>
          新增角色
        </Button>
        <Table stripe :columns="columns" :data="roles" size="small" ref="table" style="min-height: 600px"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;text-align: center">
            <Page :current="pages.page" :total="pages.count" :page-size="10" @on-change=""></Page>
          </div>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="editModal"
           title="编辑角色"
           ok-text="OK"
           cancel-text="Cancel"
           @on-ok="editRole"
           @on-cancel=" editRoles={ID: '', Name: '', Slug: '', PermissionStr: [], MenuStr: []} ">
      <div class="modal-cont">
        <p>
          <span>姓名:</span>
          <Input v-model="editRoles.Name" placeholder="输入角色名字" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
        </p>
        <p>
          <span>Slug:</span>
          <Input v-model="editRoles.Slug" placeholder="输入Slug" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
          <Tooltip v-if="regEditSlug" class="input-msg" placement="right">
            <Icon type="information-circled" size="20" color="#ff0000"></Icon>
            <div slot="content">
            <p>Slug只能由  数组  字母 .  *   组成</p>
            </div>
          </Tooltip>
        </p>
      </div>
    </Modal>
    <Modal v-model="editPermissionModal"
           title="管理角色权限"
           ok-text="OK"
           cancel-text="Cancel"
           @on-ok="editRole">
      <div class="modal-cont">

      </div>
    </Modal>
  </div>
</template>

<script>
  import {formatDate} from '../service/date.js'
  import qs from 'qs'
  export default {
    created () {
      this.listRoles(this.pages.page)
    },
    computed: {
      regEditSlug () {
        let editRs = this.editRoles.Slug.match(/^[A-Za-z0-9.*]+$/)
        if (this.editRoles.Slug == '') {
          return false
        } else {
          return editRs == null
        }
      }
    },
    data () {
      return {
        pages: {
          page: 1,
          count: 0
        },
        editModal: false,
        editPermissionModal: false,
        editMenuModal: false,
        editRoles: {
          ID: '',
          Name: '',
          Slug: '',
          PermissionStr: [],
          MenuStr: []
        },
        roles: [],
        columns: [
          {
            title: '编号',
            key: 'ID',
            width: 60
          },
          {
            title: '姓名',
            key: 'Name'
          },
          {
            title: 'slug',
            key: 'Slug'
          },
          {
            title: '权限管理',
            key: '',
            render: (h, params) => {
              return h('Button', {
                  attrs: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteRoles(this.roles[params.index].id)
                    }
                  }
                }, '权限管理')
            }
          },
          {
            title: '菜单管理',
            key: '',
            render: (h, params) => {

              return h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteRoles(this.roles[params.index].id)
                  }
                }
              }, '菜单管理')
            }
          },
          {
            title: '创建时间',
            key: 'createdTime',
            render: (h, params) => {
              let createdTime = this.roles[params.index].CreatedAt.replace('+08:00', ' ').replace('T', ' ').replace('Z','')
              return h('div', createdTime)
            }

          },
          {
            title: '操作',
            width: 240,
            render: (h, params) => {
              return [
                h('Button', {
                  attrs: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editRoles.ID = this.roles[params.index].ID
                      this.editRoles.Name = this.roles[params.index].Name
                      this.editRoles.Slug = this.roles[params.index].Slug
                      this.editModal = true
                    }
                  }
                }, '编辑'),
                h('Button', {
                  attrs: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteRoles(this.roles[params.index].ID)
                    }
                  }
                }, '删除'),
              ]
            }
          }
        ]
      }
    },
    methods: {
      listRoles (page) {
        this.$http.get('/api/role/list?p=' + page).then((response) => {
          let res = response.data
          console.log(res);
          if (res.status === 10000) {
            this.roles = res.Data
            this.pages.page = res.page
          }
        }).catch(() => {
        })
      },
      deleteRoles (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除该用户吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/role/delete', qs.stringify({
              ID: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listRoles(this.pages.page)
                this.$Message.success('删除成功!')
              } else {
                this.$Message.error('删除失败!')
              }
            }).catch(() => {
              this.$Message.error('通讯错误，请重试')
            })
          },
          onCancel: () => {
          }
        })
      },
      editRole () {
        this.$http.post('/api/role/save', qs.stringify({
          ID: this.editRoles.ID,
          Name: this.editRoles.Name,
          Slug: this.editRoles.Slug
        })).then((response) => {
          let res = response.data
          console.log(res)
          if (res.status === 10000) {
            this.editRoles = {
              ID: '',
              Name: '',
              Slug: '',
              PermissionStr: [],
              MenuStr: []
            }
            this.listRoles(this.pages.page)
            this.$Message.success(res.message)
          } else {
            this.$Message.error(res.message)
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
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
    min-height: 140px;
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
  .modal-cont>p .input-msg{
    position: absolute;
    right: 44px;
    top: 9px;
    display: inline-block;
    /*margin: 0 10px;*/
  }
</style>
