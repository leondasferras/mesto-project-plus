import {
  model, Schema, Model, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link: string) => validator.isURL(link),
      message: 'Некорректный формат ссылки',
    },
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) { const e = new Error('Неправильные почта или пароль'); e.name = 'notFound'; throw e; }

        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              const e = new Error('Неправильные почта или пароль'); e.name = 'notFound'; throw e;
            }
            return user;
          });
      });
  },
);

export default model<IUser, IUserModel>('User', userSchema);
