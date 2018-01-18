<template>
  <li>
    <p class="item-row" @click="toggle">
      <Icon type="arrow-right-b" :class="['icon', (isFolder || isDynamicFolder) ? folderIcon : 'file-text', isFolder ? '' : 'nofolder']"></Icon>
      <Icon :type="model.Icon" style="margin: 0 0 0 5px;"></Icon>
      {{ model.Title }}
      <span v-if="model.Uri" style="font-size: 14px;color: #2d8cf0;margin-left: 8px;">{{ model.Uri }}</span>
      <Icon type="trash-a" class="icon-btn" size="18" @click.native.stop="setTreeID(model,'delate')"></Icon>
      <Icon type="edit" class="icon-btn" size="18" @click.native.stop="setTreeID(model,'edit')"></Icon>
      <Icon type="plus-round" class="icon-btn" size="18" @click.native.stop="setTreeID(model,'add')"></Icon>
    </p>
    <ul v-if="isOpen" class="item-cont">
      <tree-menu v-for="item in orderModel" :key="item.id" :model="item" v-on:treeID="getTreeID"></tree-menu>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'treeMenu',
  props: {
    model: Object,
    subMenuData: Object
  },
  data () {
    return {
      folderIcon: 'folder',
      isDynamicFolder: false,
      isOpen: false
    }
  },
  computed: {
    // 是否有子元素
    isFolder () {
      return !!(this.model.Children && this.model.Children.length)
    },
    // 按order对menus排序
    orderModel () {
      return _.orderBy(this.model.Children, 'Order')
    }
  },
  watch: {
    // 是否
    isDynamicFolder () {
      this.isOpen = true
      this.folderIcon = 'folder-open'
    }
  },
  methods: {
    toggle () {
      const menuData = this.model
      const subMenuData = this.subMenuData

      if (subMenuData && (menuData.id === subMenuData.parentId && subMenuData.list) && !menuData.Children) {
        menuData.Children = subMenuData.list
        this.isDynamicFolder = !!(menuData.Children && menuData.Children.length)
        this.isOpen = true
        this.folderIcon = 'folder-open'
      }

      if (this.isFolder || this.isDynamicFolder) {
        this.isOpen = !this.isOpen
        this.folderIcon = this.isOpen ? 'folder-open' : 'folder'
      }
    },
    setTreeID: function (model,operate) {
      this.$emit('treeID',model,operate)
    },
    getTreeID: function (model,operate) {
      this.setTreeID(model,operate)
    }
  }
}
</script>

<style>
ul {
  list-style: none;
}
i.icon {
  margin-right: 10px;
}
p.item-row{
  line-height: 30px;
  font-size: 16px;
  vertical-align: middle;
  cursor: pointer;
  /*border-bottom: 1px solid #123456;*/
  /*margin: 2px 0;*/
}
p.item-row:hover{
  background: #ddd;
}
p.item-row i.icon-btn{
  float: right;
  padding: 7px 5px;
  display: none;
}
p.item-row:hover i.icon-btn{
  display: inline-block;
}
p.item-row i.icon-btn:hover{
  color: #2d8cf0;
}
.icon.folder {
}
.icon.folder-open {
  transition: transform .2s ease-in-out;
  transform: rotate(90deg);
}
.tree-menu li {
  line-height: 1.5;
}
.item-cont{
  padding-left: 20px;
}
.nofolder{
  /*visibility: hidden;*/
  color: #ccc;
}
</style>
