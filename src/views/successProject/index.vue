<template>
  <div class="app-container">
    <div class='title'>
    	  <h2><i style='color:#67C23A;margin-right: 5px;' class='el-icon-success'></i>代码工程创建成功</h2>
    	  <div class='btn'>
    	  	<el-button type="primary" size='mini' @click='creadCode'>生成代码工程</el-button>
    	  	<el-button type="primary" size='mini' @click='downLoad'>下载zip</el-button>
    	  </div>
    </div>
    <div class='content'>
    	  <p v-for='(item, index) in formList' :key='index'>{{item.display}}：
    	  	<span v-if='item.choices && item.type == "checkbox"'>
    	  	  [<span v-for='(check,ind) in item.value' :key='ind'>{{'"'+ item.choices[ind].name +'"'}}{{ind == item.value.length - 1 ? '' : ',  '}}</span>]
    	  	</span>
    	    <span v-else-if='item.choices && item.type != "checkbox"'>
    	  	  <span v-for='(check,ind) in item.choices' :key='ind' v-if='check.value == item.value'>{{item.choices[ind].name}}</span>
    	  	</span>
    	  	<span v-else>{{item.value}}</span>
    	  </p>
	</div>
	<el-dialog
	  title="git生成代码工程"
	  :visible.sync="dialogVisible"
	  width="500px"
	  >
	  <el-form ref='formList' :model='formData' label-width="80px" size='small' :rules='rules'>
	  	<el-form-item prop='git' label='git地址：'>
	  		<el-input v-model='formData.git' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='name' label='用户名：'>
	  		<el-input v-model='formData.name' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='password' label='密码：'>
	  		<el-input type='password' v-model='formData.password' clearable></el-input>
	  	</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" @click="subClick" size='mini' :loading='loading'>提 交</el-button>
	  	<el-button @click="dialogVisible = false" size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
    <el-dialog
	  :visible.sync="dialogSuccess"
	  class='dialog_self'
	  width="500px"
	  >
	  <p class='dialog_content'><i style='color:#67C23A;margin-right: 5px;' class='el-icon-success'></i>生成代码工程成功</p>
	  <p>{{formData.git}}</p>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" icon="document" @click='handleCopy' size='mini'>复制链接</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
    	  dialogVisible: false,
    	  dialogSuccess: false,
    	  formList: {},
    	  loading: false,
    	  formData: {
    	  	name: '',
    	  	password: '',
    	  	git: '',
    	  	distInfo: ''
    	  },
    	  rules: {
    	  	git: [
    	  	  { required: true, message: '请填写git地址', trigger: 'blur' },
    	  	  { pattern: /(http|https):\/\/([\w.]+\/?)\S*/, message: '请填写有效地址', trigger: 'change' }
    	  	],
    	  	name: { required: true, message: '请填写用户名', trigger: 'blur' },
    	  	password: { required: true, message: '请填写密码', trigger: 'blur' }
    	  }
    }
  },
  sockets: {
    'end:push': function(data) {
    	   this.loading = false
    	   if (data.result) {
  	     this.dialogVisible = false
  	     this.$nextTick(() => {
		   this.dialogSuccess = true
	     })
    	   } else {
    	   	 this.$message.error(data.message)
    	   }
    }
  },
  mounted() {
  	const formList = localStorage.getItem('formList')
  	const distInfo = Cookies.get('distInfo')
  	if (!formList) {
  	  this.$route.push('/example/codeProject')
  	} else {
  	  this.formList = JSON.parse(formList)
  	  this.formData.distInfo = JSON.parse(distInfo)
  	}
  },
  methods: {
  	downLoad() {
  	  window.location.href = process.env.SOCKET_API + '/dist/' + this.formData.distInfo.distId + '/' + this.formData.distInfo.distName
  	},
  	creadCode() {
  	  this.dialogVisible = true
  	  this.$nextTick(() => {
		 this.$refs.formList.resetFields()
	  })
  	},
  	subClick() {
  	  this.$refs.formList.validate((valid) => {
        if (valid) {
        	  this.loading = true
        	  this.$socket.emit('git:push', this.formData)
        }
     })
  	},
    handleCopy(event) {
    	  clip(this.http, event)
    	  this.dialogSuccess = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
	.title {
	  position: relative;
	  padding-bottom: 20px;
	  border-bottom: 2px solid #f1f4f6;
	  position: relative;
	  h2 {
		font-size: 18px;
		margin: 0;
		font-weight: normal;
      }
      .btn {
      	position: absolute;
      	right: 0;
      	top: 0;
      }
	}
	.content {
	  padding-top: 20px;
	  p {
	  	color: #666;
	  	font-size: 14px;
	  }
	}
	.dialog_content {
	  font-size: 14px;
	}
  }
</style>
