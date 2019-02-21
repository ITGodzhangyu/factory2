<template>
  <div class="app-container">
    <div class='title'>
    	  <h2>微服务组件列表
    	    <el-button type="primary" size='mini' style='float:right' @click='addClick'>新增</el-button>
    	  </h2>    	  
    </div>
    <div class='content'>
    	  <el-table :data="tableData" border resizable highlight-current-row header-row-class-name='table-title' element-loading-text="拼命加载中" v-loading.body="loading" header-cell-class-name='table-head'>
        <el-table-column type="index" label='序号' :index="indexMethod" width='50px'>
        </el-table-column>
        <el-table-column prop="name" label="微服务组件" min-width='20%' show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="url" label="地址" min-width='30%' show-overflow-tooltip>
        	  <template slot-scope="scope">
            <p v-for='(item, index) in scope.row.url' style='margin: 7px;' :key='index'>
            	  <el-input placeholder="请输入内容" :value="item.value" :disabled="true" size='mini'>
                <template slot="prepend">
                	  {{item.name}}
                </template>
              </el-input>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" min-width='20%' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.update_time | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='100px' align='center'>
        	  <template slot-scope="scope">
            <el-dropdown :hide-on-click="false" placement='bottom-end' @command="handleCommand($event,scope.row)">
              <span class="el-dropdown-link">
				<svg-icon icon-class='more'></svg-icon>
			  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
	</div>
	<el-dialog
	  title="配置组件地址"
	  :visible.sync="editDialog"
	  width="600px"
	  >
	  <el-form ref='formData' :model='formData' label-width="140px" size='small' label-suffix='：' style='max-height:400px;overflow:auto'>
	  	<el-form-item prop='name' label='微服务组件' :rules='rules.name'>
	  	  <el-input v-model='formData.name' clearable style='width:calc(100% - 20px)'></el-input>
	  	</el-form-item>
	  	<el-form-item v-for='(item, index) in formData.url'  :prop="'url.'+ index +'.value'" :key='index' class='formItem' :rules='rules.conment'>
	  	  <div slot="label">
	  	  	<el-input style='width: calc(100% - 50px)' v-model='item.name'></el-input>
	  	  	<span>：</span>
	  	  </div>
	  	  <el-input v-model='item.value' clearable style='width:calc(100% - 20px)'></el-input>
	  	  <i class='el-icon-remove' style='font-size: 14px;cursor: pointer;color:#999;color:#eee;display: none' @click='deleteList2(index)'></i>
	  	</el-form-item>
	  	<div style='text-align:center; background: #ddd;margin-left:30px;cursor:pointer' @click='addFromList2'>
	  	  <i class='el-icon-circle-plus-outline' style='font-size: 14px;color:rgb(36, 167, 227)'></i>
	  	</div>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" @click="editClick" size='mini' :loading='editLoad'>保 存</el-button>
	  	<el-button @click="editDialog = false" size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
	<el-dialog
	  title="新增服务列表"
	  :visible.sync="addDialog"
	  width="500px"
	  >
	  <el-form ref='addForm' :model='addForm' label-width="140px" size='small' label-suffix='：' style='max-height:400px;overflow:auto'>
	  	<el-form-item prop='name' label='微服务组件' :rules='rules.name'>
	  	  <el-input v-model='addForm.name' clearable style='width:calc(100% - 20px)'></el-input>
	  	</el-form-item>
	  	<el-form-item v-for='(item, index) in addForm.url' :prop="'url.'+ index +'.value'" :key='index' class='formItem' :rules='rules.conment'>
	  	  <div slot="label">
	  	  	<el-input style='width: calc(100% - 50px)' v-model='item.name'></el-input>
	  	  	<span>：</span>
	  	  </div>
	  	  <el-input v-model='item.value' clearable style='width:calc(100% - 20px)'></el-input>
	  	  <i class='el-icon-remove' style='font-size: 14px;cursor: pointer;color:#999;display: none' @click='deleteList(index)'></i>
	  	</el-form-item>
	  	<div style='text-align:center; background: #ddd;margin-left:30px;cursor:pointer' @click='addFromList'>
	  	  <i class='el-icon-circle-plus-outline' style='font-size: 14px;color:rgb(36, 167, 227)'></i>
	  	</div>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" @click="addSucClick" size='mini' :loading='addLoading'>保 存</el-button>
	  	<el-button @click="addDialog = false" size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
    <el-dialog
    	  title="删除微服务组件"
	  :visible.sync="deleteDialog"
	  width="500px"
	  >
	  <p>确认要删除{{editcheck.processDefinitionId}}吗？</p>
	  <span slot="footer" class="dialog-footer">
	  	<el-button type="primary" icon="document" @click='deleteSucClick' size='mini' :loading='deleteLoading'>确 认</el-button>
	  	<el-button icon="document" @click='deleteDialog=false' size='mini'>取 消</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>
import { getComponentList, addComponentList, deleteComponentList, editComponentList } from '@/api/request'
export default {
  data() {
    return {
    	  deleteDialog: false,
    	  editDialog: false,
    	  addDialog: false,
    	  loading: false,
    	  deleteLoading: false,
    	  editLoad: false,
    	  addLoading: false,
    	  tableData:[],
    	  editcheck: '',
    	  rules:{
    	  	name: { required: true, message: '请填写微服务组件名称', trigger: 'blur' },
    	  	conment: [
    	  	  { required: true, message: '请填写地址或环境名称', trigger: 'blur' },
    	  	  { pattern: /(http|https):\/\/([\w.]+\/?)\S*/, message: '请填写有效地址', trigger: 'change' }
    	  	]
    	  },
    	  urlMoment: {
    	  	url: [
    	  	  {
    	  	  	name: 'dev',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'uat',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'pre',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'prd',
    	  	  	value: ''
    	  	  }
    	    ]
    	  },
    	  addForm: {
    	  	name: '',
    	  	url: [
    	  	  {
    	  	  	name: 'dev',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'uat',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'pre',
    	  	  	value: ''
    	  	  },
    	  	  {
    	  	  	name: 'prd',
    	  	  	value: ''
    	  	  }
    	  	]
    	  },
    	  formData: {}
    }
  },
  created() {
  	this.getList()
  },
  methods: {
  	addClick() {
  	  this.addForm = {
    	  	name: '',
    	  	url: JSON.parse(JSON.stringify(this.urlMoment)).url
    	  }
  	  this.addDialog = true
  	},
  	addFromList2() {
  	  this.formData.url.push({
  	  	name: '',
  	  	value: ''
  	  })	
  	},
  	addFromList() {
  	  this.addForm.url.push({
  	  	name: '',
  	  	value: ''
  	  })
  	},
  	deleteList(index) {
  	  this.addForm.url.splice(index, 1)
  	},
  	deleteList2(index) {
  	  this.formData.url.splice(index, 1)
  	},
  	editClick() {
  	  this.$refs.formData.validate((valid) => {
  	  	if (valid) {
  	  	  this.editLoad = true
		  editComponentList(this.formData).then((res) => {
		  	this.editDialog = false
		  	this.editLoad = false
		  	this.getList()
	        this.$message.success('编辑成功！')
	     }).catch(() => {
	     	this.editLoad = false
	      	this.$message.error('编辑失败！')
	      })
  	  	}
  	  })
  	},
  	addSucClick() {
  	  this.$refs.addForm.validate((valid) => {
  	  	if (valid) {
  	  	  this.addLoading = true
	  	  addComponentList(this.addForm).then((res) => {
	  	    this.addDialog = false
	  	    this.addLoading = false
	        this.getList()
	        this.$message.success('添加成功！')
	      }).catch(() => {
	        this.addLoading = false
	        this.$message.error('添加失败！')
	      })	
  	  	} else {
  	  		
  	  	}
  	  })
  	},
  	deleteSucClick() {
  	  const params = {
  	  	id: this.editcheck.id
  	  }
  	  deleteComponentList(params).then((res) => {
        this.deleteDialog = false
  	  	this.deleteLoading = false
        this.getList()
        this.$message.success('删除成功！')
      }).catch(() => {
      	this.$message.success('删除失败！')
      	this.loading = false
      })
  	},
  	indexMethod(index) {
  	  return index + 1
  	},
  	getList() {
  	  this.loading = true
    	  getComponentList().then((res) => {
        res.forEach((item) => {
        	  const urlList = JSON.parse(item.url)
        	  const arr = []
	  	  for (const index in urlList) {
	        	const obj = {
	        	  name: index,
	        	  value: urlList[index]
	        	}
	        	arr.push(obj)
	      }
	  	  item.url = arr
        })
        this.tableData = res
        this.loading = false
      }).catch(() => {
      	this.loading = false
      })
  	},
    handleCopy(event) {
    	  clip(this.http, event)
    	  this.dialogSuccess = false
    },
    handleCommand(command, row) {
    	  this.editcheck = row  	  
      if (command === 'delete') {
        this.deleteDialog = true
      } else {
      	this.formData = JSON.parse(JSON.stringify(row))
        this.editDialog = true
      } 
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
	  	color: #999;
	  	font-size: 14px;
	  }
	}
	.dialog_content {
	  font-size: 14px;
	}
  }
</style>
