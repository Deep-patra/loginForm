const result=require('dotenv').config(),
      express=require('express'),
      jwt=require('jsonwebtoken'),
      path=require('path'),
      logger=require('morgan'),
      bcrypt=require('bcryptjs');

let users=[];
let app=express();
app.use('/',express.static(path.join(__dirname,'/public')));
app.use(express.json());
app.use(logger(':method :url :status :res[content-length]-:response-time ms'));
app.post('/auth/login',function(req,res,next){
  const foundUser=users.find((value,index,list)=>{
    if(value.username==req.body.username)return true;
    else return false;
  });
  if(foundUser){
    bcrypt.compare(req.body.password,foundUser.passwordHash,(error,matched)=>{
      if(!error && matched){
        res.status(201).json({token:jwt.sign({
          username:foundUser.username
        },process.env.SECRET)});
      }
      else console.log('error',error);
    });
  }
  else res.status(401).send(JSON.stringify(
	{Authorized:false}
  ));
});
app.post('/auth/signup',(req,res,next)=>{
  bcrypt.hash(req.body.password,10,(error,hash)=>{
    if(error)return res.status(500).send(JSON.stringify({Authenticated:false})); 
	console.log(hash);
    users.push({
      username:req.body.username,
      passwordHash:hash
    });
    res.status(201).send(JSON.stringify(
	{Authenticated:true}
    ));
  });
});

app.listen(process.env.PORT||3000,()=>{
console.log('app is listening at port 3000!');
});
