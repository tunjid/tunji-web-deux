import { Express } from 'express';
import { UserController } from '../controllers/UserController';

export default function (app: Express, userController: UserController): void {
    app.route('/api/users');
     //   .post(users.create);
    //.get(users.find);

    app.route('/api/users/:userId')
        .get(userController.requiresLogin, userController.get)
        .put(userController.requiresLogin, userController.put);
        // .delete(users.requiresLogin, users.delete);

    app.route('/api/session')
        .get(userController.session);

    /*app.route('/signup')
        .post(users.signup);*/

    app.route('/api/sign-in')
        .post(userController.signIn);

    app.route('/api/sign-out')
        .post(userController.signOut);

    // app.route('/contact')
    //     .post(users.contact);

    app.param('userId', userController.byId);
}
