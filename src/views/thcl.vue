<template>
  <div class="th">
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
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :default-sort = "{prop: 'add_time', order: 'descending'}"
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
                    <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button
                        :disabled="scope.row.state==1"
                        @click.native.prevent="enableRow(scope.row,props.row.activitys_rules_id)"
                        type="primary"
                        size="small">
                        启用
                        </el-button>
                        <el-button
                        :disabled="scope.row.state!=1"
                        @click.native.prevent="delxp(scope.row,props.row.activitys_rules_id)"
                        type="danger"
                        size="small">
                        删除
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div v-show="props.row.state==1" style="margin-top: 20px">
                    <el-button @click="add(props.row)">添加小票</el-button>
                </div>
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
        sortable
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
        <el-table-column
        fixed="right"
        label="操作"
        width="110">
        <template slot-scope="scope">
            <el-button
            :disabled="scope.row.state==-1"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small">
            回收
            </el-button>
        </template>
        </el-table-column>
    </el-table>
    <!-- 换票弹窗 -->
    <el-dialog title="添加小票" :visible.sync="dialogFormVisible">
        <el-form :model="xp">
            <el-form-item label="机台号" label-width="120px">
                <el-input v-model="xp.sktno" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="交易号" label-width="120px">
                <el-input v-model="xp.jlbh" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="金额" label-width="120px">
                <el-input v-model="xp.je" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参与活动金额" label-width="120px">
                <el-input v-model="xp.yxje" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addxp">确 定</el-button>
        </div>
    </el-dialog>
  </div>
    
</template>

<script>
export default {
    name:'thcl',
    data(){
        return{
            user:'',
            loading:false,
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
            queryData:[],
            dialogFormVisible:false,
            xp:{

            },
            
        }
    },
    methods:{
        // 退货
        deleteRow(index, rows) {
            // console.log(rows[index])
            let {id}=rows
                this.$confirm('确定要回收该笔记录吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('activity/cunpon_th',{id,user:this.user})
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '回收成功',
                                type: 'success'
                            });
                            this.filter()                        
                        }else{
                            this.$message({
                            message: res.data.msg,
                            type: 'warning'
                            });
                        }
                    })
                    .catch(err=>{
                        this.$message.error(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
            });
        },
        // 添加小票
        add(rows){
            console.log(rows)
            let {activitys_rules_id,custom_id,hyid,hykno,hyname}={...rows}
            this.xp.ruleid=activitys_rules_id
            this.xp.custom_id=custom_id
            this.xp.hyid=hyid
            this.xp.hykno=hykno
            this.xp.hyname=hyname
            this.dialogFormVisible=true
        },
        addxp(){
             this.$confirm('确定要添加吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('activity/insert_xp',this.xp)
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            // this.filter() 
                            this.xp={}
                            this.dialogFormVisible=false
                        }else{
                            this.$message({
                            message: res.data.msg,
                            type: 'warning'
                            });
                        }
                    })
                    .catch(err=>{
                        this.$message.error(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
            });
        },
        delxp(row, activitys_rules_id){
            let {xfjlid}=row
            this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('activity/del_xp',{ruleid:activitys_rules_id,xfjlid})
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            row.state=-1
                            // this.filter()               
                        }else{
                            this.$message({
                            message: res.data.msg,
                            type: 'warning'
                            });
                        }
                    })
                    .catch(err=>{
                        this.$message.error(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
            });
        },
        // 启用小票
        enableRow(row, activitys_rules_id) {
            let {xfjlid}=row
                this.$confirm('启用后小票可再次参加活动，确定要启用吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('activity/enabel_xp',{ruleid:activitys_rules_id,xfjlid})
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '启用成功',
                                type: 'success'
                            });
                            this.filter()
                                                    
                        }else{
                            this.$message({
                            message: res.data.msg,
                            type: 'warning'
                            });
                        }
                    })
                    .catch(err=>{
                        this.$message.error(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
            });
        },
        tableRowClassName({row, rowIndex}) {
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
            this.loading=true
            this.$axios.post('activity/exchangelist',this.query)
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
    mounted:function(){
        let user=this.$utils.getUrlKey('userid')
        this.user=user
        this.loadRuleList()
        // if(user==null||user==''){
        //     // window.location.href = 'http://eip.chiconysquare.com'
        // }else{
        //     this.user=user
        //     this.loadRuleList()
        // }
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