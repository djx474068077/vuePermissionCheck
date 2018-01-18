<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo">
        <img src="" height="100%" width="auto" alt="">
      </div>
      <div class="layout-nav">
        <span class="layout-logout" @click="logout">
          注销
        </span>
      </div>
    </Menu>
    <div class="layout-content">
      <Row>
        <Col span="5">
          <Menu @on-select="menuSelect" active-name="2-2" width="auto" :open-names="['2']">
            <!--<Submenu name="1">-->
            <!--<template slot="title">-->
            <!--<Icon type="ios-navigate"></Icon>-->
            <!--运行统计-->
            <!--</template>-->
            <!--<MenuItem name="1-1">-->
            <!--主页-->
            <!--</MenuItem>-->
            <!--</Submenu>-->
            <!--<Submenu name="2">-->
              <!--<template slot="title">-->
                <!--<Icon type="ios-navigate"></Icon>-->
                <!--资讯管理-->
              <!--</template>-->
              <!--<MenuItem class="menu-item" name="2-1">-->
                <!--发布资讯-->
              <!--</MenuItem>-->
              <!--<MenuItem class="menu-item" name="2-2">-->
                <!--资讯列表-->
              <!--</MenuItem>-->
              <!--<MenuItem class="menu-item" name="2-3">-->
                <!--回收站-->
              <!--</MenuItem>-->
            <!--</Submenu>-->
            <!--<Submenu name="3">-->
              <!--<template slot="title">-->
                <!--<Icon type="ios-keypad"></Icon>-->
                <!--活动管理-->
              <!--</template>-->
              <!--<MenuItem class="menu-item" name="3-1">发布活动</MenuItem>-->
              <!--<MenuItem class="menu-item" name="3-2">活动列表</MenuItem>-->
              <!--<MenuItem class="menu-item" name="3-3">保险管理</MenuItem>-->
            <!--</Submenu>-->
            <!--<Submenu name="4">-->
              <!--<template slot="title">-->
                <!--<Icon type="ios-analytics"></Icon>-->
                <!--用户管理-->
              <!--</template>-->
              <!--<MenuItem name="4-1">用户列表</MenuItem>-->
              <!--<MenuItem name="4-2">用户反馈</MenuItem>-->
            <!--</Submenu>-->
            <!--<Submenu name="5">-->
            <!--<template slot="title">-->
            <!--<Icon type="ios-analytics"></Icon>-->
            <!--论坛管理-->
            <!--</template>-->
            <!--<MenuItem name="5-1">帖子列表</MenuItem>-->
            <!--<MenuItem name="5-2">管理员发帖</MenuItem>-->
            <!--</Submenu>-->
            <!--<Submenu name="6">-->
              <!--<template slot="title">-->
                <!--<Icon type="ios-analytics"></Icon>-->
                <!--订单管理-->
              <!--</template>-->
              <!--<MenuItem name="6-1">订单列表</MenuItem>-->
              <!--<MenuItem name="6-2">已发货</MenuItem>-->
            <!--</Submenu>-->
            <Submenu name="7">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                权限管理
              </template>
              <MenuItem class="menu-item" name="7-1">权限列表</MenuItem>
            </Submenu>
            <Submenu name="8">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                角色管理
              </template>
              <MenuItem class="menu-item" name="8-1">角色列表</MenuItem>
            </Submenu>
            <Submenu name="9">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                菜单管理
              </template>
              <MenuItem class="menu-item" name="9-1">菜单管理</MenuItem>
              <MenuItem class="menu-item" name="9-2">其他</MenuItem>

            </Submenu>
          </Menu>
        </Col>
        <Col span="19">
        <div class="layout-content-main">
          <router-view></router-view>
        </div>
        </Col>
      </Row>
    </div>
    <div class="layout-copy">
      2011-2016 &copy; TalkingData
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        active: '1-1',
        nav: {
          '2-1': {
            path: '/main/news/add',
            title: '发布资讯'
          },
          '2-2': {
            path: '/main/news/list',
            title: '资讯列表'
          },
          '2-3': {
            path: '/main/news/trash',
            title: '回收站'
          },
          '3-1': {
            path: '/main/tourism/add',
            title: '发布活动'
          },
          '3-2': {
            path: '/main/tourism/list',
            title: '活动列表'
          },
          '3-3': {
            path: '/main/tourism/insurance',
            title: '保险管理'
          },
          '4-1': {
            path: '/main/user/list',
            title: '用户列表'
          },
          '4-2': {
            path: '/main/message/list',
            title: '用户反馈'
          },
          '5-1': {
            path: '/main/user/list',
            title: '帖子列表'
          },
          '5-2': {
            path: '/main/user/comment',
            title: '管理员发帖'
          },
          '7-1': {
            path: '/main/permission/list',
            title: '权限管理'
          },
          '8-1': {
            path: '/main/role/list',
            title: '角色管理'
          },
          '9-1': {
            path: '/main/menu/list',
            title: '菜单管理'
          },
          '9-2': {
            path: '/main/menu/list',
            title: '菜单管理'
          },
        }
      }
    },
    created () {
//      this.userCheck()
    },
    methods: {
      logout () {
        this.$Modal.confirm({
          title: '确认注销',
          content: '<p>点击确认退出登录</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.post('/api/admin/logout').then((response) => {
              let res = response.data
              if (res.status === 10000) {
                this.$router.push({
                  path: '/'
                })
                this.$Message.info('注销成功!')
              }
            }).catch(() => {
              this.$Message.error('通讯错误，请重试')
            })
          },
          onCancel: () => {
          }
        })
      },
      userCheck () {
        this.$http.post('/api/checkLogin').then((response) => {
          let res = response.data
          if (res.status === 10000) {
          } else {
            this.$router.push({
              path: '/'
            })
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      },
      menuSelect (name) {
        this.$router.push({
          path: this.nav['' + name + ''].path
        })
        document.title = this.nav['' + name + ''].title
      }
    },
//    watch: {
//      '$route' () {
//        this.userCheck()
//      }
//    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .layout-logo{
    display: inline-block;
  }
  .layout-nav{
    display: inline-block;
    float: right;
    color: #ffffff;
    padding: 0 30px;
    line-height: 60px;
  }
  /*.layout-logout{*/
    /*display: inline-block;*/
    /*color: #ffffff;*/
    /*padding: 0 30px;*/
    /*line-height: 60px;*/
  /*}*/
</style>
