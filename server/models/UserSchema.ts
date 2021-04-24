import { Document, Model, model, Schema } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { UserLike } from '../../client/src/common/Models';

export interface UserDocument extends Document, UserLike {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    accessLevel: string;
    provider: string;
    salt: Buffer;
    hashPassword: (password: string) => string,
    authenticate: (password: string) => boolean
}

export interface UserModel extends Model<UserDocument> {
    findUniqueUsername: (username: string, suffix?: number) => Promise<string | undefined>
}

const UserSchema = new Schema<UserDocument, UserModel>({
    accessLevel: String,
    firstName: String,
    lastName: String,
    imageUrl: String,
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        validate: [
            function (password: string) {
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

UserSchema.methods.hashPassword = function (this: UserDocument, password: string): string {
    return pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

UserSchema.methods.authenticate = function (this: UserDocument, password: string): boolean {
    return this.password === this.hashPassword(password);
};

UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return this.firstName + ' ' + this.lastName;
}).set(function (this: UserDocument, fullName: string) {
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
    const possibleUsername = username + (suffix || '');

    try {
        const document = await this.findOne({username: possibleUsername}).exec();
        if (!document) return possibleUsername;

        return await this.findUniqueUsername(username, (suffix || 0) + 1);
    } catch (e) {
        return undefined;
    }
};

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: (doc: UserDocument, ret: Partial<UserDocument>) => {
        delete ret.password;
        delete ret.salt;
        delete ret.accessLevel;
        delete ret.provider;
        return ret;
    }
});

export const User = model<UserDocument, UserModel>('User', UserSchema);
