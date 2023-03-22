const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        arr = fileName.split('.');
        let newFileName = '';
        for (let i = 0; i < arr.length; i++) {
            if(i!= arr.length-1){
                newFileName = arr[i];

            }else{
                newFileName += ('-'+Date.now()+'-'+arr[i]);
            }
        }
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB
  })
// var upload = multer({ storage: storage, fileSize: 1000000}) //,  ,limits: {fileSize: 1*1024*1024} 

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    try {
      const file = req.file
      if (!file) {
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          throw error
      }
      res.send(file)
    } catch (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size should be less than 1MB",
          error: err
        });
      }
      next(err);
    }
  })

app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});