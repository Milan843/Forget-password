const express=require("express")
const app=express()
const jwt=require('jwt-simple')
let mongoose=require('mongoose')
let User=require('./model/model')
var nodemailer = require('nodemailer');

app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))


let mydb='mongodb://localhost/example';
mongoose.connect(mydb,{ useNewUrlParser: true , useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.render('index')
  })

app.post('/user',(req,res)=>{
    var newuser=new User();
         newuser.email=req.body.email;
         newuser.password=req.body.password;
         
 
         newuser.save((err,data)=>{
             if(err){
                 res.send(err)
             }
             else{
                 res.send(data)
                 console.log(data)
             }
 
         })
 })
const secret='what is the color of orange'
let d=new Date()
let time=d.getTime()
console.log(time)
app.post("/server",(req,res)=>{
    console.log(req.body.email)
    Email=req.body.email
    User.findOne({
        email:Email 
    })
    .exec((err,data)=>{
        if(err) throw err
         console.log(data,"sgahb")
        res.json(data.email)
        const token=jwt.encode({email:Email, time}, secret) //token generated
        console.log(token)

        var transporter = nodemailer.createTransport({
            //   service: 'gmail',
            host:"mail.vinove.com" ,
            secure:false,
              port:587,
              auth: {
                user: 'milan.srivastava@mail.vinove.com',
                pass: 'milan@2019'
              },
              tls:{
                  rejectUnauthorized:false
              }
            });
            
            var mailOptions = {
              from: 'milan.srivastava@mail.vinove.com',
              to:Email,
              subject: 'Password change request',
              text: `this is the response of your password change request  please go to the requested url and type your new password url='http://localhost:8999/password_change/${token}'`};
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
    })
})

app.get('/password_change/:token', (req, res)=>{
    const d=new Date()
    let t=d.getTime()
    const secret='what is the color of orange'
    const token=req.params.token
    const decodedtoken=jwt.decode(token, secret)
    const email=decodedtoken.email
    const time=decodedtoken.time
    console.log(t,time)
    if(t-time<100000){
        res.render('change_pssw',{email})
    }
    else{
        res.send('error loading page')
    }
})
app.post('/change_pass', async (req, res)=>{
    await User.updateOne({email:req.body.email}, {password:req.body.password1}, (err, res)=>{
        if(err) throw err;
        console.log('password updated successfully '+req.body.email+req.body.password1+res)
    })
    res.redirect('/');
})

app.listen(8999)



