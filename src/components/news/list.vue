<template>
  <div class="news-list">
    <Table stripe :columns="columns" :data="news" size="small" ref="table"></Table>
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
      this.listNews()
    },
    data () {
      return {
        pages: {
          page: 1,
          count: 0
        },
        news: [],
        columns: [
          {
            title: '#',
            key: 'id',
            width: 60
          },
          {
            title: '标题',
            key: 'title'
          },
          {
            title: '更新时间',
            key: 'create_time',
            render: (h, params) => {
              let time = this.news[params.index].create_time.replace('+08:00', ' ').replace('T', ' ')
              return [
                h('div', time)
              ]
            }

          },
          {
            title: '作者',
            key: 'author'

          },
          {
            title: '点赞人数',
            key: 'thumbs'

          },
          {
            title: '封面',
            key: 'cover',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: this.news[params.index].cover
                },
                style: {
                  width: '60px',
                  height: '60px'
                }
              })
            }
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
                      this.$router.push({path: '/main/news/edit', query: {id: this.news[params.index].id}})
                    }
                  }
                }, '查看与编辑'),
                h('Button', {
                  attrs: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deleteNews(this.news[params.index].id)
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
      listNews (page) {
        this.$http.get('/api/news/list?p=' + page).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.news = res.data
            this.pages.count = res.count
            this.pages.page = res.page
          }
        }).catch(() => {
        })
      },
      deleteNews (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/news/preDelete', qs.stringify({
              id: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listNews()
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
