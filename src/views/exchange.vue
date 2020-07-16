<template>
  <div class="main">
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
              <el-select placeholder="请选择状态"   v-model="query.state">
                <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
          </el-col>
      </el-row>
      <el-row class="query">
          <el-col :span="5">
              <el-input placeholder="请输入会员卡号" prefix-icon="el-icon-postcard"
               v-model="query.hykno">
               </el-input>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="5">
              <el-input placeholder="请输入机台号" prefix-icon="el-icon-monitor"
               v-model="query.sktno">
               </el-input>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="5" >
              <el-input placeholder="请输入交易号" prefix-icon="el-icon-data-line"
               v-model="query.jlbh">
               </el-input>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="6">
              <el-button type="primary" @click="filter" icon="el-icon-search">搜索</el-button>
          </el-col>
      </el-row>

    <el-table
    border
    :summary-method="Summaries"
    show-summary
    row-class-name="warning-row"
    :data="queryData"
    style="width: 100%;">
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-table
                border
                :summary-method="getSummaries"
                show-summary
                :row-class-name="tableRowClassName"
                :data="props.row.xsjl"
                style="width: 100%">
                    <el-table-column
                    label="机台号"
                    prop="sktno">
                    </el-table-column>
                    <el-table-column
                    label="交易号"
                    prop="jlbh">
                    </el-table-column>
                    <el-table-column
                    label="日期"
                    prop="jzrq">
                    </el-table-column>
                    <el-table-column
                    label="金额"
                    prop="je">
                    </el-table-column>
                    <el-table-column
                    label="有效金额"
                    prop="yxje">
                    </el-table-column>
                    <el-table-column
                    label="状态"
                    :formatter="formatState"
                    prop="state">
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <!-- <el-table-column
        label="流水号"
        prop="id">
        </el-table-column> -->
        <el-table-column
        label="活动"
        width="250"
        prop="subject">
        </el-table-column>
        <el-table-column
        label="卡号"
        width="150"
        prop="hykno">
        </el-table-column>
        <el-table-column
        label="券名称"
        prop="cunpon_name">
        </el-table-column>
        <el-table-column
        label="数量"
        width="80"
        prop="num">
        </el-table-column>
        <el-table-column
        label="兑换时间"
        width="180"
        prop="add_time">
        </el-table-column>
        <el-table-column
        label="状态"
        :formatter="formatState"
        width="100"
        prop="state">
        </el-table-column>
    </el-table>
  </div>
    
</template>

<script>
export default {
    name:'exchange',
    data(){
        return{
            query:{
                ruleid:'',
                start:'',
                end:'',
                hykno:'',
                sktno:'',
                jlbh:'',
                state:''
            },
            stateList:[
                {id:'1',name:'正常'},
                {id:'-1',name:'已回收'},
            ],
            RuleList:[],
            queryData:[]
        }
    },
    methods:{
        tableRowClassName({row, rowIndex}) {
            console.log(row.state)
            if (row.state == -1) {
                return 'warning-row';
            } 
        },
        formatState(val){
            if(val.state==-1){
                return '已回收'
            }else{
                return '正常'
            }
        },
        // 合计行
        Summaries(param){
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '计'
                } else if (column.property === 'num' ) {
                    const values = data.map(item => item["state"]==1?Number(item[column.property]):0)
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                        }, 0)
                    } else {
                        sums[index] = ''
                    }
                } else {
                    sums[index] = ''
                }
            })
            return sums
        },
        getSummaries (param) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                sums[index] = '总计'
                } else if (column.property === 'je' || column.property === 'yxje' ) {
                    const values = data.map(item => item["state"]==1?Number(item[column.property]):0)
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                        }, 0)
                    } else {
                        sums[index] = ''
                    }
                } else {
                    sums[index] = ''
                }
            })
            return sums
        },
        // 查询兑换记录
        filter(){
            this.$axios.post('activity/exchangelist',this.query)
            .then(res=>{
                this.queryData=res.data.data
            })
            .catch(err=>{
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
    mounted:function(){
        this.loadRuleList()
    }
}
</script>


<style scoped>
.query{
    margin: 20px;
    display: flex;
}
.el-table__row.warning-row{
    background-color: coral;
}

</style>