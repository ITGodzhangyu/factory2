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
	  width="500px"
	  >
	  <el-form :model='formData' label-width="40px" size='small'>
	  	<el-form-item prop='dev' label='dev：'>
	  		<el-input v-model='formData.dev' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='uat' label='uat：'>
	  		<el-input v-model='formData.uat' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='pro' label='pro：'>
	  		<el-input v-model='formData.pro' clearable></el-input>
	  	</el-form-item>
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
	  <el-form :model='addForm' label-width="120px" size='small'>
	  	<el-form-item prop='name' label='微服务组件：'>
	  	  <el-input v-model='addForm.name' clearable></el-input>
	  	</el-form-item>
	  	<el-form-item prop='url' label='url：'>
	  	  <el-input v-model='addForm.url' clearable></el-input>
	  	</el-form-item>
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
import { getComponentList, addComponentList, deleteComponentList } from '@/api/request'
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
    	  addForm: {
    	  	name: '',
    	  	url: ''
    	  },
    	  formData: {
    	  	dev: '',
    	  	uat: '',
    	  	pro: ''
    	  }
    }
  },
  created() {
  	this.getList()
  },
  methods: {
  	addClick() {
  	  this.addForm = {
    	  	name: '',
    	  	url: ''
    	  }
  	  this.addDialog = true
  	},
  	editClick() {
  	  this.editLoad = true
//	  editComponentList(this.formList).then((res) => {
//	  	this.editDialog = false
//	  	this.editLoad = false
//      this.$message.success('编辑成功！')
//   }).catch(() => {
//   	this.editLoad = false
//    	this.$message.error('编辑失败！')
//    })
  	},
  	addSucClick() {
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
