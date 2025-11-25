import express from 'express';
import { setupApp } from './setup-app';

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Testing endpoint: http://localhost:${PORT}/ht_02/api/testing/all-data`);
    console.log(`Blogs endpoint: http://localhost:${PORT}/ht_02/api/blogs`);
    console.log(`Posts endpoint: http://localhost:${PORT}/ht_02/api/posts`);
})