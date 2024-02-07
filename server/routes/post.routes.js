"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
var express = require('express');
var controller = require("../controllers/post.controller");
exports.postsRouter = express();
var multer_config_1 = require("../config/multer.config");
var multer = require('multer');
var postUploadDetail = multer((0, multer_config_1.getPostMulterConfig)());
exports.postsRouter.get('/cul/posts', controller.getPosts);
exports.postsRouter.post('/cul/posts/createpost', postUploadDetail.array('files'), controller.createPost);
exports.postsRouter.get('/cul/posts/:id', controller.getSinglePost);
exports.postsRouter.patch('/cul/posts/:id', controller.updatePost);
exports.postsRouter.delete('/cul/posts/:id', controller.deletePost);
exports.postsRouter.post('/cul/posts/:id', controller.togglePostLike);
exports.postsRouter.post('/cul/comments/createcomment/:id', controller.createComment);
exports.postsRouter.get('/cul/comments/:id', controller.getComments);
exports.postsRouter.patch('/cul/comments/:commentindex', controller.updateComment);
exports.postsRouter.delete('/cul/comments/:commentindex', controller.deleteComment);