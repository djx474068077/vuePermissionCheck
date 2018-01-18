<template>
  <div class="menu-list">
    <!--<Table stripe :columns="columns" :data="menu" size="small" ref="table"></Table>-->
    <Row>
      <Col span="24">
        <Card style="width: 100%;margin: 0 auto;padding: 20px;border: 1px solid #ccc;">
          <h2 slot="title">
            菜单管理
          </h2>
          <Button slot="extra" type="primary" @click.stop.prevent="addMenus.ParentId = 0;addModal = true" style="font-size: 14px;margin: 15px 8px 0 0;">
            <Icon type="plus-round" size="16"></Icon>
            新增根节点
          </Button>
          <Card style="min-height: 600px;padding: 20px 80px;border: 1px solid #ccc;">
            <p v-if="menus == null" style="font-size: 18px;">暂无数据</p>
            <ul v-else>
              <my-tree v-on:treeID="getTreeID" v-for="menuItem in orderMenus" :key="menuItem.id" :model="menuItem" ></my-tree>
            </ul>
          </Card>
        </Card>
      </Col>

    </Row>
    <!--<div style="margin: 10px;overflow: hidden">-->
      <!--<div style="float: right;text-align: center">-->
        <!--<i-button type="primary" size="large" style="margin-bottom: 5px" @click="addModal = true">新增</i-button>-->
        <!--<Page :current="pages.page" :total="pages.count" :page-size="10" @on-change="listMenus"></Page>-->
      <!--</div>-->
    <!--</div>-->
    <Modal v-model="addModal"
           title="添加菜单"
           ok-text="确认"
           cancel-text="取消"
           @on-ok="addMenu">
      <div class="modal-cont">
        <p >
          <span>父节点:</span>
          <Input v-model="addMenus.ParentId" disabled placeholder="输入菜单名字" style="width: 300px"></Input>
        </p>
        <p >
          <span>Title:</span>
          <Input v-model="addMenus.Title" placeholder="输入菜单名字" style="width: 300px">
            <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
        </p>
        <p>
          <span>Icon:</span>
          <Input v-model="addMenus.Icon" placeholder="输入图标代码" style="width: 300px">
            <span slot="prepend" style="padding: 0 5px;"><Icon type="navicon-round" size="16"></Icon></span>
          </Input>
          <Tooltip class="input-msg" placement="right">
            <Icon type="help-circled" size="16" color="#123456"></Icon>
            <div slot="content">
              <p>使用 iview 组件</p>
              <p>填入图标代码即可</p>
            </div>
          </Tooltip>
        </p>
        <p>
          <span>Uri:</span>
          <Input v-model="addMenus.Uri" placeholder="输入Uri路径" style="width: 300px">
            <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
        </p>
        <p>
          <span>级别:</span>
          <Input number v-model="addMenus.Order" placeholder="输入级别" style="width: 300px">
            <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
          <Tooltip class="input-msg" placement="right">
            <Icon type="help-circled" size="16" color="#123456"></Icon>
            <div slot="content">
              <p>数字越小，优先级越高</p>
            </div>
          </Tooltip>
        </p>
      </div>
    </Modal>
    <Modal v-model="editModal"
           title="Modal Title"
           ok-text="OK"
           cancel-text="Cancel"
           @on-ok="editMenu">
      <div class="modal-cont">
        <p>
          <span>父节点:</span>
          <Input v-model="editMenus.ParentId" disabled placeholder="输入菜单名字" style="width: 300px"></Input>
        </p>
        <p>
          <span>Title:</span>
          <Input v-model="editMenus.Title" placeholder="输入菜单名字" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
        </p>
        <p>
          <span>Icon:</span>
          <Input v-model="editMenus.Icon" placeholder="输入图标代码" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="navicon-round" size="16"></Icon></span>
          </Input>
          <Tooltip class="input-msg" placement="right">
            <Icon type="help-circled" size="20" color="#123456"></Icon>
            <div slot="content">
            <p>使用 iview 组件</p>
            <p>填入图标代码即可</p>
            </div>
          </Tooltip>
        </p>
        <p>
          <span>Uri:</span>
          <Input v-model="editMenus.Uri" placeholder="输入Uri路径" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
        </p>
        <p>
          <span>级别:</span>
          <Input number v-model="editMenus.Order" placeholder="输入级别" style="width: 300px">
          <span slot="prepend" style="padding: 0 5px;"><Icon type="compose" size="16"></Icon></span>
          </Input>
          <Tooltip class="input-msg" placement="right">
            <Icon type="help-circled" size="20" color="#123456"></Icon>
            <div slot="content">
            <p>数字越小，优先级越高</p>
            </div>
          </Tooltip>
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {formatDate} from '../service/date.js'
  import myTree from './treeMenu.vue'
  import qs from 'qs'
  export default {
    created () {
      this.listMenus(1)
    },
    components: {
      myTree
    },
    data () {
      return {
        addModal: false,
        editModal: false,
        pages: {
          page: 1,
          count: 0
        },
        addMenus: {
          ParentId: '',
          Icon: '',
          Order: '',
          Title: '',
          Uri: '',
          Children: []
        },
        editMenus: {
          ParentId: '',
          Icon: '',
          Order: '',
          Title: '',
          Uri: '',
          Children: []
        },
        menus: [],
      }
    },
    computed: {
      parentTitle (parentId) {
//        return
      },
      orderMenus () {
        return _.orderBy(this.menus, 'Order')
      }
    },
    methods: {
      listMenus (page) {
        this.$http.get('/api/menu/tree?p=' + page).then((response) => {
          let res = response.data
//          console.log(res)
          if (res.status === 10000) {
            this.menus = res.tree
            console.log(this.menus)
            this.pages.page = res.page
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      deleteMenu (index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确认要删除吗？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/menu/delete', qs.stringify({
              ID: index
            })).then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.listMenus()
                this.$Message.success('删除成功!')
              }
            }).catch(() => {
              this.$Message.error('通讯错误，请重试')
            })
          },
          onCancel: () => {
          }
        })
      },
      addMenu () {
        this.$http.post('/api/menu/save', qs.stringify({
          ParentId: this.addMenus.ParentId,
          Title: this.addMenus.Title,
          Icon: this.addMenus.Icon,
          Uri: this.addMenus.Uri,
          Order: this.addMenus.Order
        })).then((response) => {
          let res = response.data
          if(res.status === 10000) {
            this.$Message.success('新增成功！')
            this.listMenus(1)
            this.addMenus={
              ParentId: '',
              Icon: '',
              Order: '',
              Title: '',
              Uri: '',
              Children: []
            }
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      editMenu () {
        this.$http.post('/api/menu/save',qs.stringify({
          ID: this.editMenus.ID,
          ParentId: this.editMenus.ParentId,
          Title: this.editMenus.Title,
          Icon: this.editMenus.Icon,
          Uri: this.editMenus.Uri,
          Order: this.editMenus.Order
        })).then((response) => {
          let res = response.data
          if(res.status === 10000) {
            this.$Message.success('修改成功！')
            this.listMenus(1)
            this.editMenus={
              ParentId: '',
              Icon: '',
              Order: '',
              Title: '',
              Uri: '',
              Children: []
            }
          } else {
            this.$Message.error(res.message)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      getTreeID:function (model,operate) {
        switch (operate){
          case 'add':
            console.log(model)
            this.addMenus.ParentId = model.ID
            this.addModal = true
            break;
          case 'edit':
            this.editMenus.ID = model.ID
            this.editMenus.ParentId = model.ParentId
            this.editMenus.Title = model.Title
            this.editMenus.Icon = model.Icon
            this.editMenus.Uri = model.Uri
            this.editMenus.Order = model.Order
            this.editModal = true
            break;
          case 'delate':
            this.deleteMenu(model.ID)
            break;
          default:
            this.$Message.error("操作错误")
        }
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
.menu-list{
  font-size: 18px;
}

.ivu-collapse-content>.ivu-collapse-content-box{
  padding: 2px;
}
.item-icon{
  display: none;
  float: right;
  margin-right: 8px;
}
.ivu-collapse-header:hover .item-icon{
  display: block;
}
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
.modal-cont>p .input-msg{
  position: absolute;
  right: 44px;
  top: 9px;
  display: inline-block;
  /*margin: 0 10px;*/
}
</style>
