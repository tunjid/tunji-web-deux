import { Express } from 'express';
import * as users from '../controllers/UserController';

export default function (app: Express): void {
    app.route('/api/users');
     //   .post(users.create);
    //.get(users.find);

    app.route('/api/users/:userId')
        .get(users.requiresLogin, users.get)
        .put(users.requiresLogin, users.put);
        // .delete(users.requiresLogin, users.delete);

    app.route('/session')
        .get(users.session);

    /*app.route('/signup')
        .post(users.signup);*/

    app.route('/signin')
        .post(users.signin);

    app.route('/signout')
        .post(users.signout);

    // app.route('/contact')
    //     .post(users.contact);

    app.param('userId', users.userById);
}
