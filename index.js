var express = require('express');
var app = express();
var multer = require('multer');

var storage = multer.diskStorage({
    destination : function (req, file , cb){
        cb(null, './uploads');
    },
    filename : function(req, file , cb){
        cb(null, file.originalnames);
    }
});
var upload = multer({storage: storage});
app.get('/uploads', function(req, res){
    res.render('uploads');
});
app.post('/uploads', upload,single("avatar"),function(req, res){
    console.log(req.file);
    res.send('Thanh cong')
});