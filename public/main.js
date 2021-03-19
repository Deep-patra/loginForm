//console.log('Hello World!');
"use strict";
const _link=document.getElementById('signup');
const _Login=document.querySelector('.LoginForm'),
    _Signup=document.querySelector('.SignUpForm'),
    submit=document.getElementById('submit'),
    container=document.querySelector('.container'),
    spw=document.getElementById('spw');

let activeForm='form1';
  
  function update(text){
    let garbage=document.body.removeChild(container);
    let p=document.createElement('p');
    p.style.fontSize='20px';
    p.textContent=text;
    document.body.appendChild(p);
  }    

 function sendData(obj){
   if(activeForm=='form1'){
     fetch('/auth/login',{
       method:'POST',
       headers:{'Content-Type':'application/JSON'},
       mode:'cors',
       cache:'no-cache',
       credentials:'same-origin',
       body:JSON.stringify({name:obj.name,
         password:obj.password
       })
     }).then(res=>{
	if(res.status==201){
       update('Welcome!');
       console.log(res);
	}
	else{
	update('Your Username is not Authorized');
	}
     }).catch(err=>{
       console.log(err);
     });
   }
   else{
     fetch('/auth/signup',{
       method:'POST',
       mode:'cors',
       credentials:'same-origin',
       headers:{'Content-Type':'application/JSON'},
       cache:'no-cache',
       body:JSON.stringify({name:obj.name,
         password:obj.password
       })
     }).then(response=>response.json()).then(res=>{
	if(res.Authenticated==true){
       update('you are authorized ...Refresh the page and login to check your authorization');
       console.log(res);
	}
	     else{
	update('Some error has occured...TryAgain');
	     }
     }).catch(err=>{
       console.log('error:',err);
     })
   }
   return;
 }

      
 //function to check validity of the entered password    
function checkValidity(value){
  const pwRules=document.querySelector('.pw-rules');
  switch (false) {
    case value.length > 8:
      pwRules.textContent = 'Entered password must contain al least 8 characters!';
      return false;
    case (/[A-Z]+/g.test(value)):
      pwRules.textContent = 'Entered password must contain a Capital letter!';
      return false;
    case (/\d+/g.test(value)):
      pwRules.textContent = 'Entered password must contain a Digit';
      return false;
    case (/[a-z]+/g.test(value)):
      pwRules.textContent = 'Entered password must contain a lower cade letter!';
      return false;
    case (/[^A-Za-z0-9]/.test(value)):
      pwRules.textContent = 'Entered password must contain atleast one special characters e.g $,%,&,@ etc!';
      return false;
    default:
      pwRules.textContent='';
      return true;
  }
  
}

function checkInput(ev){
if(ev.target.value==''){
  ev.target.parentNode.style.borderColor='black';
  ev.target.parentNode.style.boxShadow='0 0 5px rgba(0,0,0,0.4)';
}
 if(!checkValidity(ev.target.value)){
   ev.target.parentNode.style.borderColor='red';
   ev.target.parentNode.style.boxShadow='0 0 5px red';
 }
 else{
   ev.target.parentNode.style.borderColor='green';
   ev.target.parentNode.style.boxShadow='0 0 5px green';
 }
}
  

window.addEventListener('input',function(ev){
  let node=ev.target;
  if(Array.isArray(ev.target)){
    node=ev.target[0];
  }
  switch(node){
    //case for Signup conform password input element
    case document.getElementById('cpw'):
      const n = document.querySelector('.cw-rules');
      const parNode=node.parentNode;
      if(node.value==''){
        n.textContent='';
        parNode.style.borderColor='black';
        parNode.style.boxShadow='0 0 5px rgba(0,0,0,0.4)';
      }
      else if (node.value===spw.value && node.value != '') {
        n.textContent = '';
        parNode.style.borderColor = 'green';
        parNode.style.boxShadow = '0 0 5px green';
      }
      else{
        n.textContent='Entered password must be same!';
        parNode.style.borderColor='red';
        parNode.style.boxShadow='0 0 5px red';
      }
        break;
    case document.getElementById('spw'):
      checkInput(ev);
      break;
      
 //events for Username input Elements 
  
    case document.getElementById('lUsername'):
    case document.getElementById('sUsername'):
      node.parentNode.style.borderColor='black';
      node.parentNode.style.boxShadow='0 0 5px rgba(0,0,0,0.4)';
      if(node.value!=''){
        node.parentNode.style.borderColor='green';
        node.parentNode.style.boxShadow='0 0 5px green';
      }
      break;
      
    default:
      break;
  }
},false);


function checkEntries(){
  let obj={};
  if(activeForm=='form1'){
    Object.defineProperty(obj,'name',{value:document.getElementById('lUsername').value.toString()});
    Object.defineProperty(obj,'password',{value:document.getElementById('lpw').value.toString()});
    if((obj.name!='') && (obj.password!='')){
      sendData(obj);
      return true;
    }
    else return false;
  }
  else{
    Object.defineProperty(obj,'name',{value:document.getElementById('sUsername').value.toString()});
    Object.defineProperty(obj,'password',{value:document.getElementById('spw').value.toString()});
    if(obj.name!='' && checkValidity(obj.password)){
      console.log(obj);
      sendData(obj);
      return true;
    }
    else return false;
  }
}

//EventListener for 'click' event
window.addEventListener('click',function(ev){
  const node=ev.composedPath();
  switch(true){
    
  //case to display the password to the user in login form
    case (node.includes(document.getElementById('logInShowPassword'))):  
      if(document.getElementById('lpw').type=='password'){
    document.getElementById('lpw').type='text';
      }
      else{
        document.getElementById('lpw').type='password';
  }
      break;
      
  //case to display password to user in signup form
    case (node.includes(document.getElementById('signUpShowPassword'))):
      let spw = document.getElementById('spw');
      if (spw.type == 'password') {
        spw.type = 'text';
      }
      else {
        spw.type = 'password';
      }
      break;
    case (node.includes(_link)):
      _Login.style.display = 'none';
      _Signup.style.display = 'flex';
      activeForm='form2';
      break;
  //case for Submit button
    case (node.includes(submit)):
      submit.disabled=true;
      if(checkEntries()){
        container.style.borderColor='green';
        container.style.boxShadow='0 0 10px green';
        return;
      }
      else{
        container.style.borderColor='red';
        container.style.boxShadow='0 0 10px red';
      }
      break;
  }
},false);

