const sql = require('./SqlHelper')

let activityRule = {
    id: '',
    activity_id: '',
    state: 0,
    start_date: '',
    end_date: '',
    limit_type: 1,
    limit_num: 0,
    lj_flag: 0,
    gold_flag: 1,
    only_flag: 0,
    online_flag: 0,
    activityDept: [],
    activityCoupon: [],
    activity_no_fkfs: [],
    add_user: ''
}

// 获取当前活动列表 无数据参数
let getActivityList=(callback)=>{
    let queryTask = `select A.*,B.subject,B.description from activitys_rules A 
    inner join activitys B on A.activitys_id=B.id where A.state=2`
    sql.query(queryTask, (err, recordset) => {
        if (!err) {
            let set = recordset.recordset
            let result = {
                code: 0,
                msg: '成功',
                data: set
            }
            callback(null, result)
        }else{
            callback(err, null)
        }
        
    })
}

//获取具体活动规则信息 数据参数为{id:id}
let getActivityInfo=(param,callback)=>{
    let {id}=param
    if(id){
        let _this=this
        let queryTask=`select * from activitys_rules where id='${id}'`
        sql.query(queryTask, (err, recordset) => {
            if (!err) {
                let set = recordset.recordset
                _this.activityRule={...set[0]}
                console.log(_this.activityRule)
                
            }else{
                callback(err, null)
            }
            
        })
    }else{
        callback({code:-1,msg:'活动规则id不能为空'},null)
    }
}

let list = (obj,callback) => {
    let {id}=obj
    let queryTask = 'select * from activitys_rules'
    if(id){
        queryTask=`select * from activitys_rules where id='${id}'`
    }
    sql.query(queryTask, (err, recordset) => {
        if (!err) {
            let set = recordset.recordset
            let result = {
                code: 0,
                msg: '成功',
                data: set
            }
            callback(null, result)
        }else{
            callback(err, null)
        }
        
    })
}

let save = (model,fun) => {
    let queryTask = `select * from activitys_rules where id='${model.id}'`
    sql.query(queryTask, (err, recordset) => {
        if(!err){
            let set = recordset.recordset
            if (set.length == 0) {
                add(model,(err,recordset)=>{
                    fun(err,recordset)
                })
            }else{
                fun('已经存在，不能重复添加',null)
            }
        }else{
            fun(err,null)
        }
    })

}

function add(model,callback) {
    promiseAddRule(model)
    .then(()=>{
       return  promiseAddCunpon(model.id,model.activityCoupon)
    })
    .then(()=>{
        return  promiseAddDept(model.id,model.activityDept)
    }).then(()=>{
        return  promiseAddNoFKFS(model.id,model.activity_no_fkfs)
    }).then(()=>{
        callback(null,model.id)
    }).catch(err=>{
        callback(err)
    })
}


// 定义规则添加过程Promise
function promiseAddRule(model){
    let insertTask = `insert into activitys_rules(id,activitys_id,start_date,end_date
        ,limit_type,limit_num,lj_flag,gold_flag,only_flag,online_flag,add_user,add_time)  
        values(@id,@activitys_id,@start_date,@end_date,@limit_type,@limit_num,@lj_flag
        ,@gold_flag,@only_flag,@online_flag,@add_user,getdate())`
        let param = [
            { name: 'id', value: model.id },
            { name: 'activitys_id', value: model.activity_id },
            { name: 'start_date', value: model.start_date },
            { name: 'end_date', value: model.end_date },
            { name: 'limit_type', value: model.limit_type },
            { name: 'limit_num', value: model.limit_num },
            { name: 'lj_flag', value: model.lj_flag },
            { name: 'gold_flag', value: model.gold_flag },
            { name: 'only_flag', value: model.only_flag },
            { name: 'online_flag', value: model.online_flag },
            { name: 'add_user', value: model.add_user }
        ]
    return new Promise((resolve,reject)=>{
        sql.queryWithParams(insertTask, param, (err, recordset) => {
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
        
}

function promiseAddCunpon(ruleid,cunponArray){
    return new Promise((resolve,reject)=>{
        if(cunponArray.length==0){
            reject("活动规则需要绑定券")
        }else{
            let task=''
            for(let i=0;i<cunponArray.length;i++){
                let el=cunponArray[i]
                task+=` insert into cunpon(activitys_rules_id,cunpon_id,cunpon_name,start_date,end_date,stock,left_stock,max_num,price,exchange_price,cunpon_type) 
                values('${ruleid}','${el.cunpon_id}','${el.cunpon_name}','${el.start_date}','${el.end_date}',${el.stock},${el.left_stock},${el.max_num},${el.price},${el.exchange_price},${el.cunpon_type}); `
            }
            sql.query(task,(err, recordset) =>{
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        }
    })
        
}

function promiseAddDept(ruleid,deptArray){
    return new Promise((resolve,reject)=>{
        if(deptArray.length==0){
            resolve()
        }else{
            let task=''
            for(let i=0;i<deptArray.length;i++){
                task+=` insert into activitys_shop(activitys_rules_id,deptid,deptname) 
                values('${ruleid}','${el.id}','${el.label}'); `
            }
            sql.query(task,(err, recordset) =>{
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        }
    })
}

function promiseAddNoFKFS(ruleid,no_fkfs){
    return new Promise((resolve,reject)=>{
        if(no_fkfs.length==0){
            resolve()
        }else{
            let task=''
            for(let i=0;i<no_fkfs.length;i++){
                task+=` insert into no_fkfs(activitys_rules_id,skfs,skfs_name) 
                values('${model.id}','${el.id}','${el.label}'); `
            }
            sql.query(task,(err, recordset) =>{
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        }
    })
}



module.exports = {
    activityRule,
    list,
    save
}