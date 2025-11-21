import {Router} from "express";
import {getPostHandler} from "./handlers/get-post.handler";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";

export const postsRouter: Router = Router({});

postsRouter
    .get("", getPostListHandler)
    .get("/:id", getPostHandler)
    .post("", createPostHandler)
    .put("/:id", updatePostHandler)
    .delete("/:id", deletePostHandler);