<template>
  <div class="news-list">
    <Table stripe :columns="columns" :data="messages" size="small" ref="table"></Table>
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
      this.listMessages()
    },
    data () {
      return {
        pages: {
          page: 1,
          count: 0
        },
        messages: [],
        columns: [
          {
            title: '#',
            key: 'id',
            width: 60
          },
          {
            title: '用户信息',
            key: 'author'
          },
          {
            title: '反馈时间',
            key: 'create_time',
            render: (h, params) => {
              let time = this.messages[params.index].create_time.replace('+08:00', ' ').replace('T', ' ')
              return [
                h('div', time)
              ]
            }

          },
          {
            title: '反馈内容',
            key: 'content'

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
                      this.deleteMessage(this.messages[params.index].id)
                    }
                  }
                }, '删除')
              ]
            }
          }
        ]
      }
    },
    methods: {
      listMessages (page) {
        this.$http.get('/api/message/list?p=' + page).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.messages = res.data
            this.pages.count = res.count
            this.pages.page = res.page
          }
        }).catch(() => {
        })
      },
      deleteMessage (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/message/delete', qs.stringify({
              id: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listMessages()
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

