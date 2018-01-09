const Comments = function () {
  this.comments=[];
}
Comments.prototype.addComment = function (comment) {
  this.comments.unshift(comment);
};

Comments.prototype.map = function (mapperFn) {
  return this.comments.map(mapperFn);
};

Comments.prototype.asJSONString = function () {
  return JSON.stringify(this.comments,null,2)
};

module.exports=Comments;
