

let displayComments = function () {
  document.getElementById('comments').innerHTML=this.response;
}

let loadComments = function () {
  let xml= new XMLHttpRequest();
  xml.onload=displayComments;
  xml.open('get','/comments');
  xml.send();
}

 window.onload = function () {
   loadComments();
 };
