var express = require('express');

const app=express()

app.use('/',(err,res,next)=>{
    res.send('服务已启动')
})


app.listen(3000)