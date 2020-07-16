<template>
    <div>
        <el-row class="query">
          <el-col :span="6">
              <el-select  placeholder="请选择活动" class="RuleList" filterable v-model="query.ruleid">
                <el-option
                v-for="item in RuleList"
                :key="item.id"
                :label="item.subject"
                :value="item.id">
                </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
              <el-date-picker type="date" placeholder="开始日期" value-format="yyyy-MM-dd" v-model="query.start" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="5">
              <el-date-picker type="date" placeholder="结束日期" value-format="yyyy-MM-dd" v-model="query.end" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="6">
              <el-button type="primary" @click="filter" icon="el-icon-search">搜索</el-button>
          </el-col>
      </el-row>
      <el-table
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        row-class-name="warning-row"
        :data="queryData"
        style="width: 100%;">
            <el-table-column
                label="档期"
                prop="subject">
            </el-table-column>
            <el-table-column
                label="日期"
                prop="RQ">
            </el-table-column>
            <el-table-column
                label="小票合计金额"
                prop="JE">
            </el-table-column>
            <el-table-column
                label="小票合计张数"
                prop="SL">
            </el-table-column>       
      </el-table>
    </div>
</template>

<script>
    export default {
        name:'report',
        data(){
            return {
                loading:false,
                RuleList:[],
                queryData:[],
                query:{
                    ruleid:'',
                    start:'',
                    end:''
                }
            }
        },
        methods:{
            filter(){
                this.loading=true
                this.$axios.post('activity/report_xp',this.query)
                .then(res=>{
                    this.loading=false
                    this.queryData=res.data.data
                })
                .catch(err=>{
                    this.loading=false
                    this.$message.error(err);
                })
            },
            // 加载活动
            loadRuleList(){
                this.$axios.get('activity/rulelist')
                .then(res=>{
                    this.RuleList=res.data.data
                })
                .catch(err=>{
                    this.$message.error(err);
                })
            },

        },
        mounted(){
            this.loadRuleList()
        }

    }
</script>

<style  scoped>
.query{
    margin: 20px;
    display: flex;
}
.el-table__row.warning-row{
    background-color: coral;
}
</style>