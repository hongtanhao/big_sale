
var express = require('express');
var fs = requier('fs');
var router = express.Router();
var app = express(); 
app.use(router)



// 查询文章列表路由 用于博客前端展示数据不包含草稿内容
export default router.get('/api/data', function(req, res){
  fs.readFile('../api.json','utf-8',function(err,data){
    if(err){
      console.log(err);
    }else{
      res.json(data);
    }
  })
})
