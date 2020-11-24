<template>
  <div class="rule">
    <el-form
      :model="activityRule"
      :disabled="activityRule.state!=-1"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动主题" prop="activitys_id" required>
        <el-select
          :disabled="activityRule.activitys_id>0"
          class="activityList"
          v-model="activityRule.activitys_id"
          placeholder="请选择"
        >
          <el-option
            v-for="item in activityList"
            :key="item.id"
            :label="item.subject"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="8">
          <el-form-item prop="start_date">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              v-model="activityRule.start_date"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="8">
          <el-form-item prop="end_date">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              v-model="activityRule.end_date"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="限制兑换" required>
        <el-col :span="6">
          <el-radio v-model="activityRule.limit_type" :label="0" border>单日</el-radio>
          <el-radio v-model="activityRule.limit_type" :label="1" border>档期内</el-radio>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单张发票" prop="dzfp" required>
            <el-radio-group v-model="activityRule.dzfp">
            <el-radio-button  :label="0" border>否</el-radio-button>
            <el-radio-button  :label="1" border>是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="限制次数" prop="limit_num" required>
            <el-input-number v-model="activityRule.limit_num" :min="0" label="0表示不限制次数"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span class="tip">*0表示不限制次数</span>
        </el-col>
      </el-form-item>
      <el-form-item label="消费累计" required>
        <el-col :span="6">
          <el-form-item prop="lj_flag">
            <el-radio-group v-model="activityRule.lj_flag">
              <el-radio-button :label="0">当天</el-radio-button>
              <el-radio-button :label="1">档期</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="多倍标记" prop="gold_flag">
            <el-radio-group v-model="activityRule.gold_flag">
              <el-radio-button :label="0">否</el-radio-button>
              <el-radio-button :label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="独占标记" prop="only_flag">
            <el-radio-group v-model="activityRule.only_flag">
              <el-radio-button :label="0">否</el-radio-button>
              <el-radio-button :label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="仅算线上消费" prop="online_flag">
            <el-radio-group v-model="activityRule.online_flag">
              <el-radio-button :label="0">否</el-radio-button>
              <el-radio-button :label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-table :data="activityRule.activityCoupon" height="250" border style="width: 100%">
        <el-table-column :formatter="formatType" prop="coupon_type" label="券类型" width="80"></el-table-column>
        <el-table-column prop="cunpon_name" label="券名称" width="250"></el-table-column>
        <el-table-column prop="start_date" label="有效期开始" width="150"></el-table-column>
        <el-table-column width="150" prop="end_date" label="有效期结束"></el-table-column>
        <el-table-column prop="price" label="面值" width="80"></el-table-column>
        <el-table-column width="120" prop="exchange_price" label="兑换金额"></el-table-column>
        <el-table-column width="100" prop="stock" label="总库存"></el-table-column>
        <el-table-column width="100" prop="left_stock" label="剩余库存"></el-table-column>
        <el-table-column width="100" prop="minCount" label="起兑张数"></el-table-column>
        <el-table-column prop="max_num" label="最多兑换次数"></el-table-column>
      </el-table>
    </el-form>
    <el-row class="option">
      <el-button
        @click="showTreeFlag=true"
        :disabled="false"
        type="primary"
        style="margin-left: 16px;"
      >设置部门</el-button>
      <el-button @click="showListFlag=true" type="primary" style="margin-left: 16px;">剔除付款别</el-button>
      <el-button
        @click="showCouponTable=true"
        :disabled="!(activityRule.state==-1)"
        type="primary"
        style="margin-left: 16px;"
      >添加奖品</el-button>
      <span class="blank"></span>
      <el-button
        @click="addRule"
        :disabled="!(activityRule.state==-1)"
        type="success"
        icon="el-icon-check"
        style="margin-left: 16px;"
      >保存</el-button>
      <el-button
        @click="eidtRulle"
        :disabled="!(activityRule.state==0)"
        type="info"
        icon="el-icon-edit"
        style="margin-left: 16px;"
      >编辑</el-button>
      <el-button
        @click="shRule"
        :disabled="!(activityRule.state==0)"
        type="warning"
        icon="el-icon-warning"
        style="margin-left: 16px;"
      >审核</el-button>
      <el-button
        @click="pubRule"
        :disabled="!(activityRule.state==1)"
        type="danger"
        icon="el-icon-upload"
        style="margin-left: 16px;"
      >发布</el-button>
    </el-row>
    <el-drawer :visible.sync="showTreeFlag">
      <el-tree
        :data="deptlist"
        show-checkbox
        default-expand-all
        node-key="deptid"
        ref="tree"
        :props="defaultProps"
        highlight-current
      ></el-tree>
    </el-drawer>

    <el-drawer @opened="setFkbCheckedNodes" :visible.sync="showListFlag">
      <el-tree
        :data="fkfslist"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="fkbtree"
        :props="defaultProps"
        highlight-current
      ></el-tree>
      <!-- :default-checked-keys="activityRule.activity_no_fkfs" -->
    </el-drawer>

    <el-dialog title="奖品" :visible.sync="showCouponTable" open="bindClick">
      <el-form :model="editCunpon" :rules="CunponRules" ref="CunponForm">
        <el-form-item label="券类型" :label-width="formLabelWidth" prop="cunpon_type">
          <el-radio-group v-model="editCunpon.cunpon_type">
            <el-radio-button :label="0">商友券</el-radio-button>
            <el-radio-button :label="1">猫酷券</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="券编号" :label-width="formLabelWidth" prop="cunpon_id">
          <el-input v-model="editCunpon.cunpon_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="券名称" :label-width="formLabelWidth" prop="cunpon_name">
          <el-input v-model="editCunpon.cunpon_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="有效期" required>
          <el-col :span="10">
            <el-form-item prop="start_date">
              <el-date-picker
                type="date"
                placeholder="开始日期"
                value-format="yyyy-MM-dd"
                v-model="editCunpon.start_date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="end_date">
              <el-date-picker
                type="date"
                placeholder="截止日期"
                value-format="yyyy-MM-dd"
                v-model="editCunpon.end_date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth" required>
          <el-col :span="8">
            <el-form-item prop="stock">
              <el-input-number v-model="editCunpon.stock" :min="0" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限兑次数" prop="max_num">
              <el-input-number v-model="editCunpon.max_num" :min="0" label="0表示不限制次数"></el-input-number>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="面值" :label-width="formLabelWidth" required>
          <el-col :span="8">
            <el-form-item prop="price">
              <el-input-number v-model="editCunpon.price" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起兑张数" prop="minCount">
              <el-input-number v-model="editCunpon.minCount" :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="级距" :label-width="formLabelWidth" prop="exchange_price">
          <el-input-number v-model="editCunpon.exchange_price" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCouponTable = false">取 消</el-button>
        <el-button type="primary" ref="add" @click="addCunpon('CunponForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "rule",
  data() {
    return {
      isDeptFirstOpen: true,
      deptlist: [
        {
          id: "0131",
          label: "营业一部",
          children: [
            { id: "013101", label: "国际精品课" },
            { id: "013103", label: "少女服饰课" },
            { id: "013104", label: "国际精品课-2" },
            { id: "013105", label: "国际精品课-2" }
          ]
        },
        {
          id: "0132",
          label: "营业二部",
          children: [
            { id: "013201", label: "淑女内衣课" },
            { id: "013204", label: "童玩家用课" },
            { id: "013205", label: "淑女内衣课-2" }
          ]
        },
        {
          id: "0133",
          label: "营业三部",
          children: [
            { id: "013301", label: "绅士服饰课" },
            { id: "013302", label: "运动休闲课" },
            { id: "013304", label: "童玩家用课-2" }
          ]
        },
        {
          id: "0134",
          label: "营业四部",
          children: [
            { id: "013401", label: "超级市场课" },
            { id: "013402", label: "生活美食课" },
            { id: "013403", label: "生活美食课-2" }
          ]
        }
      ],
      isFkbFirstOpen: true,
      fkfslist: [
        { id: 1, label: "现金" },
        { id: 2, label: "国内银行卡" },
        { id: 3, label: "国外银行卡" },
        { id: 4, label: "储值卡" },
        { id: 8, label: "零钱包" },
        { id: 9, label: "商品券" },
        { id: 12, label: "支票" },
        { id: 5, label: "员工卡" },
        { id: 6, label: "福利卡" },
        { id: 10, label: "折扣" },
        { id: 7, label: "美食卡" },
        { id: 11, label: "应收账款" },
        { id: 13, label: "租赁柜业绩" },
        { id: 14, label: "现金券" },
        { id: 15, label: "团购" },
        { id: 16, label: "餐费" },
        { id: 17, label: "福利金" },
        { id: 18, label: "汉购通" },
        { id: 19, label: "汉购通1" },
        { id: 20, label: "新生卡" },
        { id: 21, label: "积分抵现" },
        { id: 22, label: "资和信商通卡" },
        { id: 23, label: "活动折扣" },
        { id: 24, label: "扣返券款" },
        { id: 25, label: "储值卡A" },
        { id: 26, label: "活动折扣1" },
        { id: 27, label: "活动折扣3" },
        { id: 28, label: "支付宝" },
        { id: 29, label: "商品券A" },
        { id: 30, label: "微信支付" },
        { id: 31, label: "银行活动" },
        { id: 32, label: "QQ钱包" },
        { id: 33, label: "支付宝活动" },
        { id: 34, label: "美食折扣" },
        { id: 35, label: "翼支付" },
        { id: 36, label: "云闪付" },
        { id: 37, label: "会员礼金" },
        { id: 38, label: "Shopping卡" },
        { id: 39, label: "现金券(员)" },
        { id: 40, label: "现金券(超)" },
        { id: 41, label: "团购(积分)" },
        { id: 42, label: "代发券" },
        { id: 43, label: "可伴电子券" },
        { id: 44, label: "厂商发行次卡" },
        { id: 45, label: "群堡发行券" },
        { id: 46, label: "现金券(1F)" },
        { id: 47, label: "贩卖积分抵现" },
        { id: 48, label: "代发券(1F)" },
        { id: 49, label: "会员钱包" },
        { id: 50, label: "会员钱包(DZ)" },
        { id: 51, label: "预售款" },
        { id: 52, label: "美妆卡(1)" },
        { id: 53, label: "美妆卡(2)" },
        { id: 54, label: "美妆卡(3)" },
        { id: 55, label: "专柜折扣" },
        { id: 56, label: "1F化妆品券300" },
        { id: 57, label: "B1F优惠券120" },
        { id: 58, label: "3F/4F/6F优惠券" },
        { id: 59, label: "2F/5F优惠券" },
        { id: 60, label: "1F化妆品2" }
      ],
      showTreeFlag: false,
      defaultProps: {
        disabled: this.disabledTree
      },
      showListFlag: false,
      showCouponTable: false,
      formLabelWidth: "70px",
      editCunpon: {
        id: 0,
        cunpon_type: 0,
        cunpon_id: "",
        cunpon_name: "",
        start_date: "",
        end_date: "",
        stock: 0,
        left_stock: 0,
        max_num: 0,
        price: 0,
        exchange_price: 0,
        minCount:1,
      },
      user: "",
      activityList: [],
      activityRule: {
        id: "",
        activitys_id: "",
        state: -1,
        start_date: "",
        end_date: "",
        limit_type: 1,
        limit_num: 0,
        dzfp:0,
        lj_flag: 0,
        gold_flag: 1,
        only_flag: 0,
        online_flag: 0,
        activityDept: [],
        activityCoupon: [],
        activity_no_fkfs: [
          // { id: 16, label: "餐费" },
          // { id: 21, label: "积分抵现" },
          // { id: 26, label: "活动折扣1" },
          // { id: 27, label: "活动折扣3" },
          // { id: 34, label: "美食折扣" },
          // { id: 37, label: "会员礼金" },
          // { id: 46, label: "现金券(1F)" },
          // { id: 52, label: "美妆卡(1)" },
          // { id: 53, label: "美妆卡(2)" },
          // { id: 54, label: "美妆卡(3)" },
          // { id: 55, label: "专柜折扣" },
          // { id: 56, label: "1F化妆品券300" },
          // { id: 57, label: "B1F优惠券120" },
          // { id: 58, label: "3F/4F/6F优惠券" },
          // { id: 59, label: "2F/5F优惠券" },
          // { id: 60, label: "1F化妆品2" }
        ],
        add_user: ""
      },
      rules: {
        activitys_id: [
          { required: true, message: "请选择活动", trigger: "blur" }
        ],
        start_date: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        end_date: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        limit_num: [
          { required: true, message: "请输入限制兑换次数", trigger: "blur" }
        ]
      },
      CunponRules: {
        cunpon_type: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        cunpon_id: [
          { required: true, message: "请输入券编号", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        cunpon_name: [
          { required: true, message: "请输入券名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        start_date: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        end_date: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
        max_num: [
          {
            required: true,
            message: "请输入限兑次数，不限制输入0",
            trigger: "blur"
          }
        ],
        price: [{ required: true, message: "请输入券面值", trigger: "blur" }],
        minCount: [{ required: true, message: "请输入起兑数量", trigger: "blur" }],
        exchange_price: [
          { required: true, message: "请输入券兑换级距", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    formatType(val) {
      if (val.cunpon_type == 0) {
        return "商友券";
      } else if (val.cunpon_type == 1) {
        return "猫酷券";
      } else {
        return "";
      }
    },
    disabledTree() {
      if (this.activityRule.state == -1) {
        return false;
      } else {
        return true;
      }
    },

    getChecked() {
      if (this.$refs.tree) {
        let deptids = this.$refs.tree.getCheckedNodes();
        this.activityRule.activityDept = [...deptids];
      } else {
        //  this.$confirm('还没有设置活动部门,确定保存吗?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '不，先设置部门',
        //     type: 'warning'
        // }).then(() => {
        // })
      }
      if (this.$refs.fkbtree) {
        let no_fkfs = this.$refs.fkbtree.getCheckedNodes();
        this.activityRule.activity_no_fkfs = [...no_fkfs];
      }
    },

    // setCheckedDeptKeys(deptidsArray) {
    //      this.$refs.tree.setCheckedKeys(deptidsArray);
    // },

    setDeptCheckedNodes() {
      if (this.isDeptFirstOpen) {
        console.log("默认设置", this.activityRule.activityDept);
        this.$refs.tree.setCheckedNodes(this.activityRule.activityDept);
        this.isDeptFirstOpen = false;
      }
    },

    setFkbCheckedNodes() {
      if (this.isFkbFirstOpen) {
        //标记第一次打开才设置初始值
        console.log("默认设置", this.activityRule.activity_no_fkfs);
        this.$refs.fkbtree.setCheckedNodes(this.activityRule.activity_no_fkfs);
        this.isFkbFirstOpen = false;
      }
    },

    addCunpon(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showCouponTable = false;
          let cunpon = { ...this.editCunpon };
          cunpon.left_stock = cunpon.stock;
          this.activityRule.activityCoupon.push(cunpon);
          this.$refs[formName].resetFields();
        } else {
        }
      });
    },
    addRule() {
      this.activityRule.add_user = this.user;
      this.getChecked();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // this.activityRule.state=0
          //检测礼品设置
          if (this.activityRule.activityCoupon.length < 1) {
            this.$notify.error({
              title: "错误",
              message: "请至少添加一种券"
            });
          } else {
            console.log(this.activityRule);
            this.activityRule.state = 0;
            this.$axios.post("activity/saverule", this.activityRule)
              .then(res => {
                console.log(res);
                this.$message({
                  type: "success",
                  message: "保存成功!"
                });
              })
              .catch(err => {
                this.activityRule.state = -1;
              });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "规则设置有误,请仔细检查"
          });
        }
      });
    },

    eidtRulle() {
      this.activityRule.state = -1;
    },
    shRule() {
      this.$confirm("审核后不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.activityRule.state = 1;
          this.$message({
            type: "success",
            message: "审核成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核"
          });
        });
    },
    pubRule() {
      this.$confirm("发布后线上即可显示，且不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.activityRule.state = 2;
          this.$message({
            type: "success",
            message: "发布成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布"
          });
        });
    }
  },
  mounted: function() {
    let params = this.$route.params;
    let { user, activitys_id } = params;
    this.user = user;
    this.activityRule.activitys_id = activitys_id;
    this.activityRule.id = this.$uuid();
    this.$axios.get("activity/activity").then(res => {
      let { data } = res.data;
      this.activityList = data;
    });
  }
};
</script>
<style>
.el-drawer__body {
  overflow: auto;
}
</style>
<style scoped>
.activityList {
  width: 35%;
}

.line {
  text-align: center;
}
.tip {
  color: red;
}
.list {
  margin-left: 20px;
}
.blank {
  margin: 0 100px;
}
</style>