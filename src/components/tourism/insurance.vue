<template>
  <div class="tourism-insurance">
    <Button type="primary" @click="insuranceModal=true">新增险种</Button>
    <div style="height: 20px"></div>
    <Table :columns="columns" :data="insurances" size="small" ref="table"></Table>
    <Modal
      v-model="insuranceModal"
      title="新增险种"
      @on-ok="submit"
      @on-cancel="cancel">
      <div style="height: 20px"></div>
      <div style="padding: 20px">
        <Form :model="formItem" :label-width="0">
          <FormItem label="">
            <Input v-model="editIn.name" placeholder="请输入险种名称"></Input>
          </FormItem>
          <FormItem label="">
            <Input v-model="editIn.price" type="number" placeholder="请输入险种价格"></Input>
          </FormItem>
        </Form>
      </div>

    </Modal>
  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    created () {
      this.listInsurance()
    },
    data () {
      return {
        editIn: {
          name: '',
          price: ''
        },
        insuranceModal: false,
        insurances: [],
        columns: [
          {
            title: '#',
            key: 'Id',
            width: 60
          },
          {
            title: '名称',
            key: 'Name'
          },
          {
            title: '价格',
            render: (h, params) => {
              let nowPrice = this.insurances[params.index].Price * 0.01
              return [
                h('div', nowPrice)
              ]
            }
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
                      this.deleteIn(this.insurances[params.index].Id)
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
      listInsurance () {
        this.$http.get('/api/insurance/list').then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.insurances = res.insurance
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      },
      submit () {
        this.$http.post('/api/insurance/add', qs.stringify({
          name: this.editIn.name,
          price: this.editIn.price
        })).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.$Message.success('新增成功')
            this.listInsurance()
          } else {
            this.$Message.error('发生了错误，请重试')
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      },
      deleteIn (index) {
        this.$http.post('/api/insurance/delete', qs.stringify({
          id: index
        })).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.$Message.success('删除成功')
            this.listInsurance()
          } else {
            this.$Message.error('发生了错误，请重试')
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      }
    }
  }
</script>

<style lang="less">

</style>
