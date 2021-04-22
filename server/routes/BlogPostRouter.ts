import { Express } from 'express'
import * as users from '../controllers/UserController';
import * as blogPosts from '../controllers/BlogPostController';

export default function (app: Express) {
    app.route('/api/blogPosts/archives')
        .get(blogPosts.getArchives);

    app.route('/api/blogPosts/recentTags')
        .get(blogPosts.getTagsOrCategories);

    app.route('/api/blogPosts')
        .post(users.requiresLogin, blogPosts.create)
        .get(blogPosts.find);

    app.route('/api/blogPosts/:blogPostId')
        .get(blogPosts.get)
        .put(users.requiresLogin, blogPosts.put)
        .delete(users.requiresLogin, blogPosts.hasAuthorization, blogPosts.delete);

    app.param('blogPostId', blogPosts.blogPostById);
};
