<template>
  <div class="tourism-add">
    <Form :model="formItem" :label-width="80">
      <FormItem label="标题">
        <Input v-model="formItem.title" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="摘要">
        <Input v-model="formItem.summary" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="普通价格">
        <Input v-model="formItem.price" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="儿童价格">
        <Input v-model="formItem.child_price" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="成人价格">
        <Input v-model="formItem.adult_price" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="选择险种">
        <Select v-model="formItem.insurance" placeholder="请选择">
          <Option v-for="item in insurances" :key="item.Id" :value="item.Id">{{item.Name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="选择日期">
        <Row>
          <Col span="11">
          <FormItem prop="date">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期" v-model="formItem.start_time"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">---</Col>
          <Col span="11">
          <FormItem prop="time">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期" v-model="formItem.end_time"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="人数上限">
        <Input v-model="formItem.user_limit" type="number" placeholder="请输入人数上限"></Input>
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
      <Form-item label="内容介绍">
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
  import ueditor from '../../components/ueditor/ueditor.vue'
  import qs from 'qs'
  export default {
    components: {
      ueditor
    },
    created () {
      this.listInsurance()
    },
    data () {
      return {
        formItem: {
          title: '',
          summary: '',
          thumbs: '',
          value: '',
          headers: '',
          child_price: '',
          adult_price: '',
          start_time: '',
          end_time: '',
          price: '',
          user_limit: '',
          insurance: '',
          cover: ''
        },
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 520
        },
        insurances: {}
      }
    },
    methods: {
      submit () {
        this.$http.post('/api/tourism/add', qs.stringify({
          title: this.formItem.title,
          summary: this.formItem.summary,
          price: this.formItem.price,
          child_price: this.formItem.child_price,
          adult_price: this.formItem.adult_price,
          start_time: this.formItem.start_time,
          end_time: this.formItem.end_time,
          user_limit: this.formItem.user_limit,
          content: this.$refs.ueditor.getContent(),
          insurance: this.formItem.insurance,
          cover: this.formItem.cover
        })).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.$Message.success('新增成功')
            this.$router.push({
              path: '/main/tourism/list'
            })
          } else {
            this.$Message.error('发生了错误，请重试')
          }
        }).catch(() => {
          this.$Message.error('通讯错误，请重试')
        })
      },
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
      handleSuccess (res) {
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
