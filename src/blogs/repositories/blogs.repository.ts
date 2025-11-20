import {Blog} from "../types/blog";
import {BlogInputDto} from "../dto/blog.input-dto";
import {db} from "../../db/in-memory.db";

export const blogsRepository = {
    findAllBlogs(): Blog[] {
        return db.blogs;
    },
    findBlogById(id: string): Blog | null {
        return db.blogs.find((b: Blog) => b.id === id ) ?? null;
    },
    createBlog(newBlog: Blog): Blog {
        db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, dto: Blog): void {
        const blog: Blog | undefined = db.blogs.find((b: Blog) => b.id === id);
        if (!blog) {
            throw new Error("Blog not found.");
        }
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;

        return;
    },
    deleteBlog(id: string): void {
        const index: number = db.blogs.findIndex((b: Blog) => b.id === id);
        if (index === -1) {
            throw new Error("Blog not found.");
        }
        db.blogs.splice(index, 1);
        return;
    }
}