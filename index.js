const express = require('express')
const app = express()

const PORT = 4000 
const HOST = '127.0.0.1';

app.use(express.static('public/'));

app.use(express.urlencoded({ extended: true }));

var connection = require('./config/db')

var multer = require('multer')

const storage = multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb) =>{
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage:storage })

app.get("/", (req, res) => {
    res.render("home.ejs")
})

app.post('/saveform', upload.single('file'), async (req, res) => {

    try {

        //  create table user(user_id int primary key auto_increment,name varchar(200),email varchar(200),phone varchar(200),position varchar(200),file varchar(200));

        var filename = req.file.filename;

        var sql = `insert into user(name,email,phone,position,file) values('${req.body.name}', '${req.body.email}', '${req.body.phone}','${req.body.position}','${filename}')`
        await connection.execute(sql)


        res.send(`<script>
            
            alert('Profile Created Successfully');
            window.location.href='/userdata'
            
            </script>`)

    } catch (err) {
        console.log(err)
        res.status(500).send("Internal Server Error")
        return;
    }
})


app.get('/userdata', async (req, res) => {

    var sql = `select * from user`;
    const result = await connection.execute(sql);
    console.log(result[0])

    // res.send(result[0]);

    const obj = { data: result[0] }


    res.render('userdata.ejs', obj)
})

app.get('/edit/:id', async (req, res) => {

    var id = req.params.id;

    var sql = `select * from user where user_id='${id}' `
    const result = await connection.execute(sql)
    console.log(result[0])

    // res.send(result[0])

    const obj = { data: result[0][0] }
    res.render('edituser.ejs', obj)
})

app.get('/delete/:id', async (req, res) => {
    var id = req.params.id;
    var sql = `delete from user where user_id='${id}'`;
    await connection.execute(sql);

    res.redirect('/userdata')
})

app.post('/updateprofile', upload.single('file'), async (req, res) => {

    var sql = `update user set name='${req.body.name}', email ='${req.body.email}', phone ='${req.body.phone}', position ='${req.body.position}', file='${req.file.filename}' where user_id='${req.body.user_id}'`
    await connection.execute(sql)

    res.redirect('/userdata')
})

app.listen(PORT,HOST,() =>{
    console.log(`Server running 'http://${HOST}:${PORT}'`)
})