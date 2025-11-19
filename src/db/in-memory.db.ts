import { Post } from "../posts/types/post";
import { Blog } from "../blogs/types/blog";

export const db = {
    blogs: <Blog[]>[
        {
            "id": "1",
            "name": "first name",
            "description": "some description",
            "websiteUrl": "https://blog.com",
        },
        {
            "id": "2",
            "name": "second name",
            "description": "some description2",
            "websiteUrl": "https://blog2.com",
        },
        {
            "id": "3",
            "name": "third name",
            "description": "some description3",
            "websiteUrl": "https://blog3.com",
        },
    ],
    posts: <Post[]>[
        {
            "id": "1",
            "title": "post1",
            "shortDescription": "description",
            "content": "string content",
            "blogId": "1",
            "blogName": "first name"
        },
        {
            "id": "2",
            "title": "post2",
            "shortDescription": "description",
            "content": "string content",
            "blogId": "2",
            "blogName": "second name"
        },
        {
            "id": "3",
            "title": "post3",
            "shortDescription": "description",
            "content": "string content",
            "blogId": "3",
            "blogName": "third name"
        }
    ]
}