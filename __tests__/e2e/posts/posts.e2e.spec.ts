import request from "supertest";
import {setupApp} from "../../../src/setup-app";
import express from "express";
import {PostInputDto} from "../../../src/posts/dto/post.input-dto";
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {POSTS_PATH, BLOGS_PATH} from "../../../src/core/paths/paths";
import {clearDb} from "../../utils/clear-db";

describe("Posts API", () => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    const testPostData: PostInputDto = {
        title: "Post title",
        shortDescription: "Post description",
        content: "post content",
        blogId: "1",
    };
    const testBlogData: BlogInputDto = {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    };

    beforeAll(async () => {
        await clearDb(app);
    });
    it('should create blog; POST /ht_02/api/posts', async () => {
        //создать блог, потом вернуть его id и создать пост.!!!
        const {
            body: {id: createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData,name: "Blog name New"})
            .expect(HttpStatus.Created);

        const newPost: PostInputDto = {
            ...testPostData,
            title: "New post title",
            shortDescription: "Post description New",
            content: "new post content",
            blogId: createdBlogId,
        }

        await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send(newPost)
            .expect(HttpStatus.Created);
    });
    it('should return posts list: GET /ht_02/api/posts', async () => {
        const {
            body: {id: createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData,name: "Blog name New"})
            .expect(HttpStatus.Created);

        await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...testPostData,
                title: "New post title",
                shortDescription: "Post description New",
                content: "new post content",
                blogId: createdBlogId,
            })
            .expect(HttpStatus.Created);
        await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...testPostData,
                title: "New post title2",
                shortDescription: "Post description New2",
                content: "new post content2",
                blogId: createdBlogId,
            })
            .expect(HttpStatus.Created);

        const postListResponse = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(postListResponse.body).toBeInstanceOf(Array);
        expect(postListResponse.body.length).toBeGreaterThanOrEqual(2);
    });
    it('should return post by id; GET /ht_02/api/posts/:id',async () => {
        const {
            body: {id: createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData,name: "Blog name New"})
            .expect(HttpStatus.Created);

        const createRespose = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...testPostData,
                title: "New post title2",
                shortDescription: "Post description New2",
                content: "new post content2",
                blogId: createdBlogId,
            })
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`${POSTS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createRespose.body,
            id: expect.any(String),
        });
    });
    it('should update post; PUT /ht_02/api/posts/:id',async () => {
        const {
            body: {id: createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData,name: "Blog name New"})
            .expect(HttpStatus.Created);

        const createRespose = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...testPostData,
                title: "New post title2",
                shortDescription: "Post description New2",
                content: "new post content2",
                blogId: createdBlogId,
            })
            .expect(HttpStatus.Created);

        const postUpdateData: PostInputDto = {
            title: "Another post title",
            shortDescription: "Post description another",
            content: "another post content",
            blogId: createdBlogId,
        };

        await request(app)
            .put(`${POSTS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken)
            .send(postUpdateData)
            .expect(HttpStatus.NoContent);

        const postResponse = await request(app)
            .get(`${POSTS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken);

        expect(postResponse.body).toEqual({
            ...postUpdateData,
            id: postResponse.body.id,
        });
    });
    it('DELETE /ht_02/api/posts/:id and check after NOT FOUND',async () => {
          const {
              body: {id: createdBlogId},
          }  = await request(app)
              .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Another Blog name"})
            .expect(HttpStatus.Created);

       const {
           body: {id: createdPostId},
       } = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...testPostData,
                title: "New post title2",
                shortDescription: "Post description New2",
                content: "new post content2",
                blogId: createdBlogId,
            })
            .expect(HttpStatus.Created);

          await request(app)
            .delete(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

          const postResponse = await request(app)
            .get(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken);
        expect(postResponse.status).toBe(HttpStatus.NotFound);
    });
})
