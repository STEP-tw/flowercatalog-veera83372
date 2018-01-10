const servFile = require('./serverLib/servFile.js');
const fs = require('fs');
const CommentsHandler = require('./lib/commentsHandler.js');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const WebApp = require('./webapp');



const getHeadOfHTMlTable = function () {
  return `<table><tr><td>Date</td> <td>Time</td><td>Name</td><td>Comment</td></tr>`;
}

const getRow = function (comment) {
  let row='<tr>';
  row +=`<td>${comment.date}</td>`;
  row +=`<td>${comment.time}</td>`;
  row +=`<td>${comment.name}</td>`;
  row +=`<td>${comment.comment}</td>`
  return `${row} </tr>`;
}

const generateCommentsAsTable = function () {
 let htmlTable = getHeadOfHTMlTable();
 htmlTable +=commentsHandler.map(getRow).join("");
 return `${htmlTable} </table>`;
}

const resourceNotFound = function (req,res) {
  res.statusCode=404;
  res.write('resource not found');
  res.end();
}


const getUserInfoAsHtml = function (user) {
  return `<h3> hello ${user.name}
  </h3>
  <a href='/logout' > Logout </a>`;
}

const addComment = function(req, res) {
  let commentInfo=req.body;
    if(commentInfo.name&&commentInfo.comment)
      commentsHandler.addComment(commentInfo.name,commentInfo.comment);
  res.redirect('/guestBook.html')
  return;
}

const redirectLoggedOutUserToLogin = function (req,res) {
  if(req.urlIsOneOf(['/addComment','/logout']) && !req.user)
    res.redirect('login.html');
}

let registered_users = [{userName:'veera',name:'veera venkata durga prasad'}];

let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectLoggedInUserToGuestBook = (req,res)=>{
  if(req.urlIsOneOf(['/login.html']) && req.user) res.redirect('/guestBook.html');
}

let respondWithLoginStatus = function (req,res) {
  let loginStatus;
  if(req.user){
    res.respond(getUserInfoAsHtml(req.user),200,{'content-type':'text/html'});
  }else{
    res.respond('false',200,{});
  }
}

const serveComments = function (req,res) {
  let commentsAsHTML= generateCommentsAsTable();
  res.respond(commentsAsHTML,200,{'content-type':'text/html'});
}

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToGuestBook);
app.use(redirectLoggedOutUserToLogin);


app.post('/addComment',addComment);
app.get('/loginStatus',respondWithLoginStatus);
app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logOn=false`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('guestBook.html');
});

app.get('/comments',serveComments);

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login.html');
});

app.postProcess(servFile);
app.postProcess(resourceNotFound);

const PORT = 5000;

let server = http.createServer(app);

server.on('error',function (err) {
  console.log(`${err.message}`)
})

server.on('listening',function () {
  console.log(`Dude I am listening on ${server.address().port}`)
})

const init = function () {
  commentsHandler=new CommentsHandler('./data/comments.json');
  commentsHandler.load();
  server.listen(PORT);
}

init();
