<template>
  <div class="app-container">
    <div class='title'>
    	  <h2>代码工程模版</h2>
    	  <el-radio-group v-model="checked">
        <el-radio-button closable v-for="(item,index) in groups" :label="item.id" :key="item.id+index">
        	  {{item.name}}
        	  <i v-if='item.name !="其他"' @click='removeGroups(item)' class='el-icon-close'></i>
        </el-radio-button>
      </el-radio-group>
      <i class='el-icon-circle-plus-outline' @click='addDialog=true;formData.name=""' style='cursor:pointer;color: #24a7e3;'></i>
    </div>
    <div class='content'>
	  <el-card v-for="item in list" :key="item.id">
		  <h3>{{item.name}}</h3>
		  <p>被调用：{{item.use_times}}</p>
		  <el-button type="primary" size='mini' @click='goLink(item)'>创建代码工程</el-button>
	  </el-card>
	  <el-card>
		 <div class='addCard' @click='addCard'>
		   <i class="el-icon-plus"></i>
		 </div>
	  </el-card>
	</div>
	<el-dialog
    	  title="添加仓库分类"
	  :visible.sync="addDialog"
	  width="500px"
	  >
	  <el-form :model='formData' label-width='80px' size='small'>
	  	<el-form-item prop='name' label='分类名称：'>
	  		<el-input v-model='formData.name' placeholder='请填写仓库名称' clearable></el-input>
	  	</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" icon="document" @click='addGroups' :loading='groupsLoad' size='mini'>确 认</el-button>
	  	<el-button icon="document" @click='addDialog=false' size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
	<el-dialog
    	  title="添加模版仓库"
	  :visible.sync="addModuleDialog"
	  width="500px"
	  >
	  <el-form :model='formModuleData' label-width='80px' size='small'>
	  	<el-form-item prop='name' label='模版名称：'>
	  		<el-input v-model='formModuleData.name' placeholder='请填写仓库名称' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='gitUrl' label='git：'>
	  		<el-input v-model='formModuleData.gitUrl' placeholder='请填写git地址' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='username' label='账户：'>
	  		<el-input v-model='formModuleData.username' placeholder='请填写git账户名' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='password' label='密码：'>
	  		<el-input v-model='formModuleData.password' type='password' placeholder='请填写git账户密码' clearable></el-input>
	  	</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" icon="document" @click='addModuleList' size='mini' :loading='moduleLoad'>确 认</el-button>
	  	<el-button icon="document" @click='addModuleDialog=false' size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>
import { getList, getModuls, deleteTypeList, addTypeList, addModuls } from '@/api/request'
export default {
  data() {
    return {
    	  checked: '1',
    	  addDialog: false,
    	  addModuleDialog: false,
    	  groupsLoad: false,
    	  moduleLoad: false,
    	  formData: {
    	  	name: ''
    	  },
    	  formModuleData: {
    	  	name: '',
    	  	typeId: '',
    	  	nameSpace: '',
    	  	gitUrl: '',
    	  	username: '',
    	  	password: ''
    	  },
      groups: [],
      list: []
    }
  }, 
  created() {
  	this.getList()
  	this.getModuls()
  },
  methods: {
    goLink(item) {
    	  this.$router.push({ path: '/example/createdProject', query: item})
    },
    removeGroups(item) {
    	  const params = {
    	  	id: item.id
    	  }
    	  deleteTypeList(params).then((res) => {
    	  	this.getList()
        this.$message.success('删除成功！')
      }).catch(() => {
      	this.$message.error('删除失败！')
      })
    },
    getList() {
    	  const params = {}
    	  getList(params).then((res) => {
        this.groups = res
      }).catch(() => {
      })
    },
    getModuls() {
    	  const params = {
    	  	typeId: this.checked
    	  }
    	  getModuls(params).then((res) => {
        this.list = res
      }).catch(() => {
      })
    },
    addCard() {
    	  this.addModuleDialog = true
    	  this.formModuleData = {
    	  	name: '',
    	  	typeId: '',
    	  	nameSpace: '',
    	  	gitUrl: '',
    	  	username: '',
    	  	password: ''
    	  }
    },
    addModuleList() {
    	  this.moduleLoad = true
    	  addModuls(this.formModuleData).then((res) => {
    	  	this.addModuleDialog = false
    	  	this.moduleLoad = false
    	  	this.getModuls()
      }).catch(() => {
      	this.moduleLoad = false
      })
    },
    addGroups() {
      this.groupsLoad = true
    	  addTypeList(this.formData).then((res) => {
    	  	this.groupsLoad = false
    	  	this.getList()
        this.$message.success('添加成功！')
        this.addDialog = false
      }).catch(() => {
      	this.groupsLoad = false
      	this.$message.error('添加失败！')
      })
    }
  },
  watch: {
  	checked() {
  	  this.getModuls()
  	}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
	.title {
	  position: relative;
	  h2 {
		font-size: 16px;
		padding-bottom: 15px;
		margin: 0;
		font-weight: normal;
		border-bottom: 2px solid #f1f4f6;
      }
      .el-radio-group {
      	margin-top: 10px;
      }
	}
	.content {
	  margin-left: -15px;
	  height: 300px;
	  .el-card {
	  	width: calc(25% - 15px);
	  	height: 130px;
	  	display: inline-block;
	  	margin-left: 15px;
	  	margin-bottom: 15px;
	  	text-align: center;
	  	&:hover {
          border-color: #24a7e3;
          cursor: pointer;
        }
        .addCard {
        	  height: 100%;
        	  i {
        	  	display: block;
        	  	font-size: 35px;
        	  	font-weight: 200;
        	  	color: #8c939d;
        	  	line-height: 88px;
        	  	height: 100%;
        	  	&:hover {
        	  	  color: #24a7e3;
        	  	}
        	  }
        }
	  	h3 {
	  	  font-weight: normal;
	  	  margin-top: 0;
	  	  margin-bottom: 10px;
	  	  font-size: 16px;
	  	}
	  	p {
	  	  color: #999;
	  	  margin-bottom: 20px;
	  	  font-size: 12px;
	  	}
	  	.el-button {
	  	  padding: 5px 10px;
	  	}
	  }
	}
  }
</style>

