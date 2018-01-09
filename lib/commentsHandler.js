const Comment = require('./comment.js');
const Comments = require('./comments.js');
const fs = require('fs');

let CommentsHandler = function (filePath) {
  this.filePath=filePath;
  this.comments=new Comments();
}

CommentsHandler.prototype.load = function () {
  let contents = fs.readFileSync(this.filePath,'utf8');
  let comments = JSON.parse(contents);
  let commentsHandler=this;
  comments.reverse().forEach(function (comment) {
    let commentObj=new Comment(comment.name,comment.comment,comment.globalDate);
    commentsHandler.comments.addComment(commentObj);
  });
};

CommentsHandler.prototype.saveComment = function () {
  let contents=this.comments.asJSONString();
  fs.writeFileSync(this.filePath,contents,'utf8');
};

CommentsHandler.prototype.addComment = function (name,comment) {
  let commentObj=new Comment(name,comment);
  this.comments.addComment(commentObj);
  this.saveComment();
};

CommentsHandler.prototype.map = function (mapperFn) {
  return this.comments.map(mapperFn);
};

module.exports=CommentsHandler;
