const express = require('express');
// const request=require('../db/myRequest')
const model=require('../db/activityModel')

const router = express.Router();

/* GET users listing. */
router.get('/get', function(req, res, next) {
    let obj= req.query
    console.log(obj)
    model.list(obj,(err,result)=>{
        if(err){
            res.send({code:-1,msg:err,data:[]})
        }else{
            res.send(result)
        }
    })
})

router.post('/save',function(req, res, next) {
    let postData=req.body
    //判断
    model.activity={...postData}
    model.save(model.activity,(err,result)=>{
        if(err){
            let result={code:-1,msg:err}
            res.send(result)
        }else{
            console.log(result)
            let {rowsAffected}=result
            if(rowsAffected.length>0&&rowsAffected[0]>0){
                res.send({code:0,msg:'成功'})
            }else{
                res.send({code:1,msg:'失败'})
            }
        }
    })
    
})

module.exports = router