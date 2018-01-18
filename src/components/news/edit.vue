<template>
  <div class="news-edit">
    <Form :model="formItem" :label-width="80">
      <FormItem label="标题">
        <Input v-model="formItem.title" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="作者">
        <Input v-model="formItem.author" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="初始阅读量">
        <Input v-model="formItem.thumbs" type="number" placeholder="请输入"></Input>
      </FormItem>
      <Form-item label="封面">
        <Row>
          <Col span="3">
          <Upload action="/api/file/upload" :show-upload-list="false"
                  :on-success="handleSuccess"
                  :on-error="handleErr"
                  :before-upload="beforeUpload"
                  :on-format-error="handleFormatError"
                  :headers="headers"
                  :format="['jpg','jpeg','png']">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
          </Upload>
          <input v-model="formItem.cover" hidden/>
          </Col>
          <Col span="6" style="margin-left: 20px">
          <div class="image-upload">
            <img :src="formItem.cover" style="max-height: 240px">
          </div>
          </Col>
        </Row>
      </Form-item>
      <Form-item label="新闻内容">
        <ueditor :value="formItem.value" :config="config" ref="ueditor"></ueditor>
      </Form-item>
      <FormItem>
        <Button type="primary" @click="save">提交</Button>
        <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import ueditor from '../../components/ueditor/ueditor.vue'
  import qs from 'qs'
  export default {
    created () {
      this.newsId = this.$route.query.id
      this.getDetail()
    },
    components: {
      ueditor
    },
    data () {
      return {
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 520
        },
        formItem: {
          title: '',
          author: '',
          thumbs: '',
          value: '',
          headers: '',
          cover: ''
        },
        newsId: '',
        detail: ''
      }
    },
    methods: {
      getDetail () {
        this.$http.get('/api/news/detail?id=' + this.newsId).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.detail = res.detail
            this.formItem.title = this.detail.Title
            this.formItem.author = this.detail.Author
            this.formItem.value = this.detail.Content
            this.formItem.thumbs = this.detail.ThumbsCount
            this.formItem.cover = this.detail.Cover
          }
        }).catch(() => {
        })
      },
      save () {
        this.$http.post('/api/news/edit', qs.stringify({
          id: this.newsId,
          title: this.formItem.title,
          author: this.formItem.author,
          content: this.$refs.ueditor.getContent(),
          thumbs: this.formItem.thumbs,
          cover: this.formItem.cover
        })).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.$Message.success('保存成功')
            this.$router.push({
              path: '/main/news/list'
            })
          } else {
            this.$Message.error('发生了错误，请重试')
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      },
      handleSuccess (res) {
        console.log(res)
        if (res.status === 10000) {
          this.formItem.cover = res.src
          this.$Message.success('上传成功')
        } else {
          this.$Message.error('上传失败,请重试')
        }
      },
      handleErr () {
        this.$Message.error('通讯错误，请重试')
      },
      beforeUpload () {
      },
      handleFormatError () {
        this.$Message.error('文件格式不正确,请上传 jpg 或 png 格式的图片')
      }
    }
  }
</script>

<style lang="less">

</style>
