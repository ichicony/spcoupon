const express = require('express');
const model=require('../db/activityRuleModel')

const router = express.Router();

router.get('/get', function(req, res, next) {
    let obj= req.query
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
    // model.activityRule={...postData}
    model.save(postData,(err,result)=>{
        if(err){
            let result={code:-1,msg:err}
            res.send(result)
        }else{
            console.log(result)
            res.send({code:0,msg:'成功'})
        }
    })
    
})

module.exports = router