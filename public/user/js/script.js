var nameError=document.getElementById('name-error');
var emailError=document.getElementById('email-error');
var passwordError=document.getElementById('password-error');
// var RepeatPasswordError=document.getElementById('RepeatPassword-error');
var numberError=document.getElementById('number-error');
var submitError=document.getElementById('submit-error');

var loginEmailError=document.getElementById('loginEmail-error');
var loginPasswordError=document.getElementById('loginPassword-error');
var loginSubmitError=document.getElementById('loginSubmit-error');




function validateName()
{
    var name=document.getElementById('signup-name').value;
    
    if(name.length==0){
        nameError.innerHTML='Name is required';
        return false;
    }
    if(name.length<3){
        nameError.innerHTML='Minimum 3 charater';
        return false;
    }
    if(!name.match( /^[a-zA-Z]+( [a-zA-Z]+)+$/)){
        nameError.innerHTML='Write full name';
        return false;
    }
   
    nameError.innerHTML= '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
}

function validatePassword(){
    var password = document.getElementById('signup-password').value;


    if(password == ""){
        passwordError.innerHTML ="Fill the password please!"
        return false;
    }
    if(password.length < 6){
        passwordError.innerHTML =  "Password length must be atleast 6 characters";
        return false;
    }
    // if(!password.match(  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)){
    //     passwordError.innerHTML='password should contain at least one numeric digit, one uppercase and one lowercase letter';
    //     return false;
    // }
   
    if(password.length > 15){
        passwordError.innerHTML = "Password length must not exceed 15 characters";
        return false;
    }
    
    passwordError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>'
    return true;
}

function validateEmail(){
    var email =  document.getElementById('signup-email').value;
    if(email.length==0){
        emailError.innerHTML = 'Email is required'
        return false;
    }
    if(!email.match( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        emailError.innerHTML = 'Email Invalid'
        return false;
    }
    if(email=='beffinyohannan25@gmail.com'){
        emailError.innerHTML = 'its my gmail id you can\'t use this.'
        return false;
    }
  

    emailError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
}

function validateNumber(){
    var number = document.getElementById('signup-number').value;
    if(number.length==0){
        numberError.innerHTML = 'Mobile no required'
        return false;
    }
    if(number.length !==10){
        numberError.innerHTML = 'Mobile no should be 10 digits'
        return false;
    }
    // if(number==9656536132){
    //     numberError.innerHTML = 'its my number you can\'t use this.'
    //     return false;
    // }
    if(!number.match(/^[0-9]{10}$/)){
        numberError.innerHTML = 'mobile number must be digit'
        return false;
    }
    
    numberError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>'
    return true;
}

// function validateRepeatPassword(){
//     var password = document.getElementById('signup-password').value;
//     var RepeatPassword = document.getElementById('contact-RepeatPassword').value;
//     if(password != RepeatPassword) {  
//         RepeatPasswordError.innerHTML = "Passwords are not same";  
        
//         return false; 
//     }
//     RepeatPasswordError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';


//     return true;
       
// }



function validateForm(){
      if(!validateName() || !validateEmail() || !validateNumber() ||  !validatePassword()) {
        submitError.style.display='block';
        submitError.innerHTML='please fill correctly';
        setTimeout(function(){submitError.style.display='none';},3000);
        return false;
      }
}


/* ---------------------------- login validation ---------------------------- */

function validateEmailLogin(){
    var email =  document.getElementById('login-email').value;
    if(email.length==0){
        loginEmailError.innerHTML = 'Email is required'
        return false;
    }
    if(!email.match( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        loginEmailError.innerHTML = 'Email Invalid'
        return false;
    }
    if(email=='beffinyohannan25@gmail.com'){
        loginEmailError.innerHTML = 'its my gmail id you can\'t use this.'
        return false;
    }
  

    loginEmailError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
   
}

function validatePasswordLogin(){
    var password = document.getElementById('login-password').value;


    if(password == ""){
        loginPasswordError.innerHTML ="Fill the password please!"
        return false;
    }
    if(password.length < 6){
        loginPasswordError.innerHTML =  "Password length must be atleast 6 characters";
        return false;
    }
    // if(!password.match(  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)){
    //     loginPasswordError.innerHTML='password should contain at least one numeric digit, one uppercase and one lowercase letter';
    //     return false;
    // }
   
    if(password.length > 15){
        loginPasswordError.innerHTML = "Password length must not exceed 15 characters";
        return false;
    }
    
    loginPasswordError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>'
    return true;
}

function validateFormLogin(){
    if(!validateEmailLogin() || !validatePasswordLogin() ) {
      loginSubmitError.style.display='block';
      loginSubmitError.innerHTML='please fill correctly';
      setTimeout(function(){loginSubmitError.style.display='none';},3000);
      return false;
    }
}