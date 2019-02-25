<template>
  <div class="app-container">
    <div class='title'>
    	  <h2>代码工程创建</h2>
    </div>
    <div class='content'>
    	  <el-form :model="formList" ref="formList" label-position='top' size='mini' status-icon :inline='true'>
		  <el-steps direction="vertical" :active="active">
		    <el-step v-for='(item, index) in formList.list' :key='index'>
		    	  <template slot="description">
		    	  	<div>
		    	  		<el-form-item :prop="'list.' + index + '.value'" :label="item.message" :key='index' :rules='item.rules'>
		    	  		  <div v-if='item.type === "input"'>
		    	  		  	<el-input v-model="item.value" :placeholder='item.message' :disabled="index < active"></el-input>
		    	  		  </div>
		    	  		  <div v-else-if='item.type === "checkbox"'>
		    	  		  	<el-checkbox-group v-model="item.value" :disabled="index < active">
					      <el-checkbox v-for="check in item.choices" :label="check.value" :key="check.value">{{check.name}}</el-checkbox>
					    </el-checkbox-group>
		    	  		  </div>
		    	  		  <div v-else-if='item.type === "textarea"'>
		    	  		  	<el-input type='textarea' :rows="3" v-model="item.value" :disabled="index < active"></el-input>
		    	  		  </div>	
		    	  		  <div v-else-if='item.type === "list"'>
		    	  		  	<el-radio-group v-model="item.value">
		    	  		  		<el-radio v-for='rad in item.choices' :label="rad.value" :key='rad.value'>{{rad.name}}</el-radio>
		    	  		  	</el-radio-group>
		    	  		  </div>	
		  		    </el-form-item>
		    	  		<el-form-item class='submit' v-if='index === formList.list.length - 1 && !item.created'>
			  		  <el-button type="primary" @click="submitForm(item)" :loading='loading'>提交</el-button>
		              <el-button @click="resetForm">取消</el-button>
			  		</el-form-item>
			  		<el-form-item class='submit' v-if='item.created'>
			  		  <el-button type="primary" @click="creatForm(item)">创建</el-button>
			  		</el-form-item>
		    	  	</div>
		    	  </template>
		    </el-step>
		  </el-steps>		  
	  </el-form>
	  </div>
	</div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
    	  active: 0,
    	  loading: false,
    	  formList: {
    	  	list: []
    	  },
      list: null,
      listLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
  	this.$socket.emit('yo:run', this.$route.query)
  },
  sockets: {
        'yo:prompt': function(data) {
        	  this.loading = false
        	  data.value = data.default
        	  data.rules = { required: true, message: data.message, trigger: 'blur' }
        	  this.formList.list.push(data)
        },
        'yo:end': function(res) {
        	  localStorage.setItem('formList', JSON.stringify(this.formList.list))
        	  Cookies.set('distInfo', res)
        	  this.$router.push('/example/successProject')
        }
  },
  methods: {
    submitForm(item) {
    	  this.$refs.formList.validate((valid) => {
        if (valid) {
        	  this.loading = true
          this.$socket.emit('yo:prompt', {
		    question: item,
		    answer: item.value
		  })
          this.active = this.formList.list.length
        }
      })
    },
    creatForm(item) {
    	  this.$router.push('/example/successProject')
    },
    resetForm() {
    	  this.$router.push('/example/codeProject')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
	.title {
	  position: relative;
	  padding: 20px 0;
	  border-bottom: 2px solid #f1f4f6;
	  h2 {
		font-size: 18px;
		margin: 0;
		font-weight: normal;
      }
	}
	.content {
		padding: 20px 0;
		position: relative;
		.el-form {
		  	.el-form-item {		  	  
		  	  margin-top: -5px;
		  	  .el-input {
		  	  	width: 500px;
		  	  }
		  	  &.submit {
		  	  	margin-top: 22px;
		  	  }
		    }
		  }
	}
  }
</style>
