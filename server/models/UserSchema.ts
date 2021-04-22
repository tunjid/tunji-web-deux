import { Document, Model, model, Schema } from 'mongoose'
import { pbkdf2Sync, randomBytes } from 'crypto'

export interface UserDocument extends Document {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    salt: Buffer;
    hashPassword: (password: string) => string
}

export interface UserModel extends Model<UserDocument> {
    findUniqueUsername: (username: string, suffix) => Promise<string | undefined>
}

const UserSchema = new Schema({
    accessLevel: String,
    firstName: String,
    lastName: String,
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        validate: [
            function (password) {
                return !!password && password.length > 6;
            },
            'Password must be greater than 6 characters'
        ]
    },
    twoFactPass: {
        type: String
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        default: 'local'
        //required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.hashPassword = function (this: UserDocument, password: string): String {
    return pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

UserSchema.methods.authenticate = function (this: UserDocument, password: string): boolean {
    return this.password === this.hashPassword(password);
};

UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.pre<UserDocument>('save', function (this: UserDocument, next) {
    if (this.password) {
        this.salt = new Buffer(randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.statics.findUniqueUsername = async function (this: UserModel, username: string, suffix): Promise<string | undefined> {
    const _this = this;
    const possibleUsername = username + (suffix || '');

    try {
        const document = await _this.findOne({username: possibleUsername}).exec();
        if (!document) return possibleUsername

        return await _this.findUniqueUsername(username, (suffix || 0) + 1);
    } catch (e) {
        return undefined;
    }
};

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

export default model<UserDocument, UserModel>('User', UserSchema);
