<template>
  <div class="news-list">
    <Table stripe :columns="columns" :data="users" size="small" ref="table"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="pages.page" :total="pages.count" :page-size="10" @on-change="listNews"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../service/date.js'
  import qs from 'qs'
  export default {
    created () {
      this.listUsers()
    },
    data () {
      return {
        pages: {
          page: 1,
          count: 0
        },
        users: [],
        columns: [
          {
            title: '#',
            key: 'id',
            width: 60
          },
          {
            title: '昵称',
            key: 'nick_name'
          },
          {
            title: '头像',
            key: 'headImg',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: this.users[params.index].headImg
                },
                style: {
                  width: '60px',
                  height: '60px'
                }
              })
            }
          },
          {
            title: '住址',
            render: (h, params) => {
              let address = this.users[params.index].province + this.users[params.index].city
              return [
                h('div', address)
              ]
            }

          },
          {
            title: '联系方式',
            key: 'mobile'

          },
          {
            title: '操作',
            width: 240,
            render: (h, params) => {
              return [
                h('Button', {
                  attrs: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deleteUsers(this.users[params.index].id)
                    }
                  }
                }, '强制删除')
              ]
            }
          }
        ]
      }
    },
    methods: {
      listUsers (page) {
        this.$http.get('/api/user/list?p=' + page).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.users = res.data
            this.pages.count = res.count
            this.pages.page = res.page
          }
        }).catch(() => {
        })
      },
      deleteUsers (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除该用户吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/user/delete', qs.stringify({
              id: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listUsers()
                this.$Message.success('删除成功!')
              } else {
                this.$Message.success('删除成功!')
              }
            }).catch(() => {
              this.$Message.error('通讯错误，请重试')
            })
          },
          onCancel: () => {
          }
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

<style lang="less">

</style>
