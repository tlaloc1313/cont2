function validateForm() {
  var x = document.forms["myForm"]["username"].value;
  var y = document.forms["myForm"]["password"].value;
  
  if (x == "") {
    document.getElementById("username_error").style.backgroundColor = "red";
    var z = document.getElementsByClassName("error-message");
  	z[0].innerHTML = "Please Enter Valid Username and Password";
  }else{
  	document.getElementById("username_error").style.backgroundColor = "Lightgrey";
  }
  
  if (y == "") {
    document.getElementById("password_error").style.backgroundColor = "red";
    var z = document.getElementsByClassName("error-message");
  	z[0].innerHTML = "Please Enter Valid Username and Password";
  }else{
    document.getElementById("password_error").style.backgroundColor = "LightGrey";
  }
  
  if (x == "" || y == ""){
  	return false ;
  }
}