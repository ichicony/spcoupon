const sql = require('./SqlHelper')

let activity = {
    id: 0,
    subject: '',
    description: '',
    state: 0,
    add_user: '',
    add_time: ''
}

let save = (model,fun) => {
    let queryTask = `select * from activitys where id=${model.id}`
    console.log(queryTask)
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

let list = (obj,callback) => {
    let {state}=obj
    let queryTask = 'select * from activitys order by id desc'
    if(state){
        queryTask=`select * from activitys where state=${state} order by id desc`
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

function add(model,fun) {
    let insertTask = `insert into activitys(subject,description,state,add_user,add_time) values(@subject,@desc,0,@add_user,getdate())`
    let param = [
        { name: 'subject', value: model.subject },
        { name: 'desc', value: model.description },
        { name: 'add_user', value: model.add_user }
    ]
     
    sql.queryWithParams(insertTask, param, (err, recordset) => {
        fun(err, recordset)
    })
}

function update() {

}

module.exports = {
    activity,
    list,
    save
}