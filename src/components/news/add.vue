<template>
  <div class="news-add">
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
          <input v-model="cover" hidden/>
          </Col>
          <Col span="6" style="margin-left: 20px">
          <div class="image-upload">
            <img :src="cover" style="max-height: 240px">
          </div>
          </Col>
        </Row>
      </Form-item>
      <Form-item label="新闻内容">
        <ueditor :value="value" :config="config" ref="ueditor"></ueditor>
      </Form-item>
      <FormItem>
        <Button type="primary" @click="submit">提交</Button>
        <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import qs from 'qs'
  import ueditor from '../../components/ueditor/ueditor.vue'
  export default {
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
        cover: ''
      }
    },
    methods: {
      submit () {
        this.$http.post('/api/news/add', qs.stringify({
          title: this.formItem.title,
          author: this.formItem.author,
          content: this.$refs.ueditor.getContent(),
          thumbs: this.formItem.thumbs,
          cover: this.cover
        })).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.$Message.success('新增成功')
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
          this.cover = res.src
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
