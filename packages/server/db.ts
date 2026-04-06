import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import {
  TopicModelName,
  TopicAttributes,
  TopicOptions
} from './models/topic';
import {
  CommentModelName,
  CommentAttributes,
  CommentOptions,
  CommentAssociationAlias
} from './models/comment';

// пример бэкэнда
// https://github.com/Yandex-Practicum/orm-simple-template/blob/d7e0670807d8e4a339558c4324afadb65bdc91a0/app/index.ts

const {
  POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST
} = process.env;

const isDev = process.env.NODE_ENV === 'development';

// подключение к локальной БД в режиме dev описано в readme
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

// структура связей
// - у темы форума может быть много комментариев
// - комментарий принадлежит какой-то теме форума
// - при удалении темы форума, удаляем все комментарии этой темы
// - комментарию принадлежат ответы на этот комментарий
// - при удалении комментария, удаляем все ответы на этот комментарий
// - комментарию принадлежат реакции на этот комментарий
// - при удалении комментария, удаляем все реакции на этот комментарий

// буквально, Topic может иметь много комментариев (Topic id будет лежать в поле topicId комментария)
Topic.hasMany(Comment, {
  foreignKey: 'topicId',
  as: CommentAssociationAlias, // Псевдоним для выборки, например Topic.getComments() (также set..., add...)***
  onDelete: 'CASCADE', // Каскадное удаление строк других таблиц с внешними ключами, которые ссылались на этот топик
});

// ***
// также поле объекта ответа будет называться в соответствии с указанным алиасом
// Topic.hasMany(Comment, {
//   ...
//   as: 'customAlias',
//   ...
// });
//
// const comments = await Topic.findByPk(
//   issueId,
//   {
//     include: [
//       { model: Comment, as: 'customAlias' },
//     ]
//   });
//
// Ответ:
//   "comments": {
//     "id": 1,
//     "authorId": 1,
//     "title": "Тема форума №1",
//     "text": "Текст темы форума №1",
//     "createdAt": "2026-04-06T06:30:18.777Z",
//     "updatedAt": "2026-04-06T06:30:18.777Z",
//     "customAlias": [ <-- вот этот ключ будет иметь называние указанное в as = 'customAlias'
//       {
//         "id": 1,
//         "authorId": 1,
//         "topicId": 1,
//         "text": "Комментарий №1 к теме форума №1",
//         "replyToCommentId": null,
//         "createdAt": "2026-04-06T06:30:25.512Z",
//         "updatedAt": "2026-04-06T06:30:25.512Z"
//       }
//     ]
//   }
//
// также ассоциации по значению ключа "as" нужны если к одной таблице есть связи из нескольких других
// к примеру, комментарию могут принадлежать ответы на него, это одна ассоциация, но
// также комментарию могут принадлежать реакции на него, это будет другая ассоциация
// const comments = await Comment.findByPk(
//   35,
//   {
//     include: [
//       { model: Comment, as: replyToCommentId }, - все комменты поле replyToCommentId=35
//       { model: Reaction, as: reactionToCommentId }, - все реакции поле reactionToCommentId=35
//     ],
//   });

// буквально, Comment всегда принадлежит какому-то топику (Topic id будет лежать в поле topicId комментария)
Comment.belongsTo(Topic, {
  foreignKey: 'topicId',
  as: 'Topic',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Comment, {
  as: 'TargetComment',
  foreignKey: 'replyToCommentId',
  onDelete: 'CASCADE',
});

Comment.hasMany(Comment, {
  as: 'Replies',
  foreignKey: 'replyToCommentId',
  onDelete: 'CASCADE',
});

// TODO Reaction model
// Reaction.belongsTo(Comment, {
//   as: 'TargetComment',
//   foreignKey: 'reactionToCommentId',
//   onDelete: 'CASCADE',
// });

// Comment.hasMany(Reaction, {
//   as: 'Reactions',
//   foreignKey: 'reactionToCommentId',
//   onDelete: 'CASCADE',
// });

export async function dbConnect() {
  try {
    // Test the connection by trying to authenticate
    await sequelize.authenticate();

    // Sync all defined models to the DB.
    await sequelize.sync({ force: true });
    // { force: true } — пересоздаёт таблицы (удаляет старые, создаёт новые). Используйте только в разработке.
    // { alter: true } — автоматически изменяет существующую таблицу, чтобы она соответствовала модели.
    // Без опций — создаёт таблицы, если их нет.

    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
