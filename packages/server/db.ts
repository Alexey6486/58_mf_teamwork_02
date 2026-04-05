import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import {
  TopicModelName,
  TopicAttributes,
  TopicOptions
} from './models/topic';
import {
  CommentModelName,
  CommentAttributes,
  CommentOptions
} from './models/comment';

const {
  POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST
} = process.env;

// https://github.com/Yandex-Practicum/orm-simple-template/blob/d7e0670807d8e4a339558c4324afadb65bdc91a0/app/index.ts
const isDev = process.env.NODE_ENV === 'development';
const sequelizeOptions: SequelizeOptions = {
  host: isDev ? 'localhost' : POSTGRES_HOST,
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: isDev ? 'postgres' : POSTGRES_DB,
  dialect: 'postgres',
};

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions);

// Инициализируем модели
export const Topic = sequelize.define(
  TopicModelName,
  TopicAttributes,
  TopicOptions,
);

export const Comment = sequelize.define(
  CommentModelName,
  CommentAttributes,
  CommentOptions,
);

Topic.hasMany(Comment, {
  foreignKey: 'topicId',
  as: 'comments', // Псевдоним для выборки
  onDelete: 'CASCADE', // Каскадное удаление
});

Comment.belongsTo(Topic, {
  foreignKey: 'topicId',
  as: 'topic', // Псевдоним для обратной связи
  onDelete: 'CASCADE',
});

// Comment.belongsTo(Comment, {
//   as: 'parent',
//   foreignKey: 'replyToCommentId',
// });
//
// Comment.hasMany(Comment, {
//   as: 'replies',
//   foreignKey: 'replyToCommentId',
// });

export async function dbConnect() {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: true });
    // { force: true } — пересоздаёт таблицы (удаляет старые, создаёт новые). Используйте только в разработке.
    // { alter: true } — автоматически изменяет существующую таблицу, чтобы она соответствовала модели.
    // Без опций — создаёт таблицы, если их нет.

    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
