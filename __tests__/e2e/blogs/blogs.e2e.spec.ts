import request from "supertest";
import {setupApp} from "../../../src/setup-app";
import express from "express";
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {clearDb} from "../../utils/clear-db";

describe("Blogs API", () => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    const testBlogData: BlogInputDto = {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    };
    beforeAll(async () => {
        await clearDb(app);
    });
    it('should create blog; POST /ht_02/api/blogs', async () => {
        const newBlog: BlogInputDto = {
            ...testBlogData,
            name: "Blog name New",
            description: "Blog description New",
            websiteUrl: "https://www.blogsNew.com/",
        }

        const result = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send(newBlog)
            .expect(HttpStatus.Created);
    });
    it('should return blogs list: GET /ht_02/api/blogs', async () => {
        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Blog name New2", description: "Blog description New2"})
            .expect(HttpStatus.Created);
        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Blog name New3", description: "Blog description New3"})
            .expect(HttpStatus.Created);

        const blogListResponse = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(blogListResponse.body).toBeInstanceOf(Array);
        expect(blogListResponse.body.length).toBeGreaterThanOrEqual(2);
    });
    it('should return blog by id; GET /ht_02/api/blogs/:id',async () => {
        const createRespose = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Blog name New3", description: "Blog description New3"})
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`${BLOGS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createRespose.body,
            id: expect.any(String),
        });
    });
    it('should update blog; PUT /ht_02/api/blogs/:id',async () => {
        const createRespose = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Another Blog", description: "Another Blog description"})
            .expect(HttpStatus.Created);


        const blogUpadateData: BlogInputDto = {
            name: "Updated name",
            description: "Updated description",
            websiteUrl: "https://www.updateblogs.com/",
        };

        await request(app)
            .put(`${BLOGS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken)
            .send(blogUpadateData)
            .expect(HttpStatus.NoContent);

        const blogResponse = await request(app)
            .get(`${BLOGS_PATH}/${createRespose.body.id}`)
            .set('Authorization', adminToken);

        expect(blogResponse.body).toEqual({
            ...blogUpadateData,
            id: blogResponse.body.id,
        });
    });
    it('DELETE /ht_02/api/blogs/:id and check after NOT FOUND',async () => {
          const {
              body: {id: createdBlogId},
          }  = await request(app)
              .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({...testBlogData, name: "Another Blog"})
            .expect(HttpStatus.Created);

          await request(app)
            .delete(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

          const blogResponse = await request(app)
            .get(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken);
        expect(blogResponse.status).toBe(HttpStatus.NotFound);
    });
})
