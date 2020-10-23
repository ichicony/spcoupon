<template>
    <div>
        <el-row class="query">
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
                label="档期ID"
                prop="id">
            </el-table-column>
            <el-table-column
                label="档期"
                prop="subject">
            </el-table-column>
            <el-table-column
                label="券ID"
                prop="cunpon_id">
            </el-table-column>
            <el-table-column
                label="券名称"
                prop="cunpon_name">
            </el-table-column>
            <el-table-column
                label="合计张数"
                prop="DHZS">
            </el-table-column>       
      </el-table>
    </div>
</template>

<script>
    export default {
        name:'Couponhz',
        data(){
            return {
                loading:false,
                RuleList:[],
                queryData:[],
                query:{
                    start:'',
                    end:''
                }
            }
        },
        methods:{
            filter(){
                this.loading=true
                this.$axios.post('activity/report_couponHZ',this.query)
                .then(res=>{
                    
                    this.loading=false
                    this.queryData=res.data.data
                })
                .catch(err=>{
                    this.loading=false
                    this.$message.error(err);
                })
            },

        },
        mounted(){
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