

let displayComments = function () {
  document.getElementById('comments').innerHTML=this.response;
}

let loadComments = function () {
  let xml= new XMLHttpRequest();
  xml.onload=displayComments;
  xml.open('get','/comments');
  xml.send();
}

let handleLoginStatus = function () {
  console.log(this.response);
  if(this.response != 'false'){
    toggle('form');
    document.getElementById('user').innerHTML=this.response;
  }
  else
    toggle('login-msg');
}


let getLoginStatus= function () {
  let xml= new XMLHttpRequest();
  xml.onload=handleLoginStatus;
  xml.open('get','/loginStatus');
  xml.send();
}

let toggle = function (id) {
  let ele = document.getElementById(id);
  if (ele.style.display === "none") {
       ele.style.display = "block";
   } else {
       ele.style.display = "none";
   }
}

 window.onload = function () {
   toggle('form');
   toggle('login-msg');
   loadComments();
   getLoginStatus();
 };
