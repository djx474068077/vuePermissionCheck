<template>
  <div class="tourism-list">
    <Table stripe :columns="columns" :data="tourisms" size="small" ref="table"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="pages.page" :total="pages.count" :page-size="10" @on-change="listNews"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    created () {
      this.listTourism()
    },
    data () {
      return {
        tourisms: [],
        pages: {
          page: 1,
          count: 0
        },
        columns: [
          {
            title: '#',
            key: 'Id',
            width: 60
          },
          {
            title: '标题',
            key: 'Title'
          },
          {
            title: '摘要',
            key: 'Summary'
          },
          {
            title: '开始时间',
            render: (h, params) => {
              let time = this.tourisms[params.index].StartTime.replace('+08:00', ' ').replace('T', ' ')
              return [
                h('div', time)
              ]
            }
          },
          {
            title: '结束时间',
            render: (h, params) => {
              let time = this.tourisms[params.index].EndTime.replace('+08:00', ' ').replace('T', ' ')
              return [
                h('div', time)
              ]
            }
          },
          {
            title: '人数限制',
            key: 'UserLimit'
          },
          {
            title: '价格',
            key: 'Price'
          },
          {
            title: '成人价格',
            key: 'AdultPrice'
          },
          {
            title: '儿童价格',
            key: 'ChildPrice'
          },
          {
            title: '封面',
            key: 'cover',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: this.tourisms[params.index].Cover
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
                      this.$router.push({path: '/main/tourism/edit', query: {id: this.tourisms[params.index].Id}})
                    }
                  }
                }, '查看与编辑'),
                h('Button', {
                  attrs: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deleteTourism(this.tourisms[params.index].Id)
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
      listTourism (page) {
        this.$http.get('/api/tourism/list?p=' + page).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.tourisms = res.data
            this.pages.count = res.count
            this.pages.page = res.page
          }
        }).catch(() => {
        })
      },
      deleteTourism (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/tourism/delete', qs.stringify({
              id: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listTourism()
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
    }
  }
</script>

<style lang="less">

</style>
