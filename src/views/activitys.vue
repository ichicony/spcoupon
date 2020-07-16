<template>
<div class="container">
    <div class="editor">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动主题" prop="subject">
            <el-input type="text" v-model="ruleForm.subject" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动说明" prop="description">
            <el-input type="textarea" :rows="5" v-model="ruleForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  type="primary" @click="submitForm('ruleForm')">添加</el-button>
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
        </el-form>
    </div>
    <div class="list">
        <el-table
            :data="activitys"
            max-height="400"
            border
            stripe
            highlight-current-row
            style="width: 100%">
            <!-- 扩展行 -->
            <el-table-column type="expand">
                   <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.description }}</span>
                    </template>
            </el-table-column>
            <el-table-column
            prop="id"
            label="编号"
            width="150">
            </el-table-column>
            <el-table-column
            prop="subject"
            label="主题"
            width="400">
            </el-table-column>
            <el-table-column
            prop="add_time"
            :formatter="formatDate"
            label="添加时间">
            </el-table-column>
            <el-table-column
            prop="state"
            :formatter="formatState"
            label="状态"
            width="120">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                :disabled="!(scope.row.state==0)"
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">规则</el-button>
                <el-button
                  :disabled="!(scope.row.state==0)"
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">作废</el-button>
              </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
export default {
    name: 'activity',
    data() {
      return {
        user:'',
        ruleForm: {
          id:0,
          subject: '',
          description: '',
          state:1,
          add_user:'',
          add_time:''
        },
        activitys:[

        ],
        rules: {
          subject: [
            { required: true, message: '请输入活动主题', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入活动说明', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
        formatState(val){
            if(val.state==-1){
                return '作废'
            }else{
                return '正常'
            }
        },
        formatDate(val){
           return this.$utils.formatJsonDateStr(val.add_time)
        },
      
      getActivityList(){
        this.$axios.get('activity/activity').then((res) => {
                  res = res.data
                  this.activitys=res.data
                 }).catch((error) => {
                  console.warn(error)
                })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let postData={...this.ruleForm}
            postData.add_user=this.user
            // 适配接口，添加 desc 属性
            postData.desc=postData.description;
            let _this=this
            this.$axios.post('activity/save',postData).then((res) => {
                  res = res.data
                  console.log(res)
                  _this.getActivityList()
                 }).catch((error) => {
                  console.warn(error)
             })

            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // handleCurrentChange(row){
      //    this.ruleForm={...row}
      // },
      handleEdit(index, row){
          // let rulePath=`/rule?userid=${this.user}`
          this.$router.push({
            path:'/rule',
            name:'rule',
            params:{
              activitys_id:row.id,
              user:this.user
            }
          })
      },
      handleDelete(index, row){

      },
    },
    mounted:function(){
        let user=this.$utils.getUrlKey('userid')
        if(user==null||user==''){
            window.location.href = 'http://eip.chiconysquare.com'
        }else{
            this.user=user
            this.getActivityList()
        }
    }
  }
</script>

<style scoped>
.container{
    width: 100%;
    height: 100%;
}
.editor{
    width: 800px;
    margin-left: 50px;
}

.list{
    width: 96%;
    margin: 20px auto;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>