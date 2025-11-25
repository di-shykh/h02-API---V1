import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";
import {PostInputDto} from "../../../src/posts/dto/post.input-dto";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';

describe ('Post API body validation check',() => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    const correctTestBlogData: BlogInputDto = {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    }
    const correctTestPostData: PostInputDto = {
        title: "Post title",
        shortDescription: "Post description",
        content: "post content",
        blogId: "1",
    }
    beforeAll(async () => {
        await clearDb(app);
    })
    it('should not create post when incorrect body passed; POST /api/posts', async () => {
           const invalidDataSet1 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "    ",
                shortDescription: "     ",
                content: "   ",
                blogId: "  ",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "",
                shortDescription: "",
                content: "",
                blogId: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "A",
                shortDescription: "A",
                content: "A",
                blogId: "1000",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        //check that nothing were created
        const postResponse = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken);
        expect(postResponse.body).toHaveLength(0);
    });
    it('should not update post when incorrect data passed; PUT /api/posts', async () => {
        const {
            body: {id:createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({correctTestBlogData})
            .expect(HttpStatus.Created);

        const {
            body: {id: createdPostId}
        } = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({...correctTestPostData, blogId: createdBlogId})
            .expect(HttpStatus.Created);

        const invalidDataSet1 = await request(app)
            .put(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "    ",
                shortDescription: "     ",
                content: "   ",
                blogId: "  ",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .put(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "",
                shortDescription: "",
                content: "",
                blogId: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .put(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestPostData,
                title: "A",
                shortDescription: "A",
                content: "A",
                blogId: "1000",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const postResponse = await request(app)
            .get(`${POSTS_PATH}/${createdPostId}`)
            .set('Authorization', adminToken)
        expect(postResponse.body).toEqual({
            ...correctTestPostData,
            id: createdPostId,
            title: correctTestPostData.title,
        });
    });
})