const Comment = function (name,comment,date=new Date()) {
  this.name=name;
  this.comment=comment;
  this.globalDate=date;
  this.date=new Date(date).toLocaleDateString();
  this.time=new Date(date).toLocaleTimeString();
}

Comment.prototype.getName = function () {
  return this.name;
};

Comment.prototype.getComment = function () {
  return this.comment;
};

Comment.prototype.getDate = function () {
  return this.date;
};

Comment.prototype.getTime = function () {
  return this.time;
};

module.exports=Comment;
