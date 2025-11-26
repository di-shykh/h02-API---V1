import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';
import {before} from "node:test";

describe ('Blog API body validation check',() => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    const correctTestBlogData: BlogInputDto = {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    }
    beforeAll(async () => {
        await clearDb(app);
    })
    it('should not create blog when incorrect body passed; POST /api/blogs', async () => {
        const invalidDataSet1 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "    ",
                description: "     ",
                websiteUrl: "randomString",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "",
                description: "",
                websiteUrl: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "A",
                description: "A",
                websiteUrl: "https://.com/",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3);

        //check that nothing were created
        const blogResponse = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken);
        expect(blogResponse.body).toHaveLength(0);
    });
    it('should not update blog when incorrect data passed; PUT /api/blogs', async () => {
        const {
            body: {id:createdBlogId}
        } = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...correctTestBlogData})
            .expect(HttpStatus.Created);
        console.log(createdBlogId);

        const invalidDataSet1 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "    ",
                description: "     ",
                websiteUrl: "randomString",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "",
                description: "",
                websiteUrl: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "A",
                description: "A",
                websiteUrl: "https://.com/",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3);

        const blogResponse = await request(app)
            .get(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
        expect(blogResponse.body).toEqual({
            ...correctTestBlogData,
            id: createdBlogId,
            name: correctTestBlogData.name,
        });
    });
})