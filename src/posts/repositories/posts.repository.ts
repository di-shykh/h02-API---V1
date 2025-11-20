import {Post} from "../types/post";
import {PostInputDto} from "../dto/post.input-dto";
import {db} from "../../db/in-memory.db";

export const postsRepository = {
    findAllPosts(): Post[] {
        return db.posts;
    },
    findPostById(id: string): Post | null {
        return db.posts.find((p: Post) => p.id === id ) ?? null;
    },
    createPost(newPost: Post): Post {
        db.posts.push(newPost);
        return newPost;
    },
    updatePost(id: string, dto: Post): void {
        const post: Post | undefined = db.posts.find((p: Post) => p.id === id);
        if (!post) {
            throw new Error("Post not found.");
        }

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;

        return;
    },
    deletePost(id: string): void {
        const index: number = db.posts.findIndex((p: Post) => p.id === id);
        if (index === -1) {
            throw new Error("Post not found.");
        }
        db.posts.splice(index, 1);
        return;
    }
}

