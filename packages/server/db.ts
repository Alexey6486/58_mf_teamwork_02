import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import {
  TopicAttributes,
  TopicModelName,
  TopicOptions,
} from './models/topic';

const {
  POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST
} = process.env;

// https://github.com/Yandex-Practicum/orm-simple-template/blob/d7e0670807d8e4a339558c4324afadb65bdc91a0/app/index.ts

const sequelizeOptions: SequelizeOptions = {
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
};

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions);

// Инициализируем модели
export const TopicSequelized = sequelize.define(
  TopicModelName,
  TopicAttributes,
  TopicOptions,
);

export async function dbConnect() {
  try {
    await sequelize.authenticate(); // Проверка аутентификации в БД
    await sequelize.sync({ alter: true }); // Синхронизация базы данных
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export const createClientAndConnect = async (): Promise<Sequelize | null> => {
  try {
    await dbConnect();
    console.log('sequelize', { sequelize, env: process.env });

    // Теперь getTableName() сработает
    const tableName = TopicSequelized.getTableName();
    console.log('Table name:', tableName);
    const topics = await TopicSequelized.findAll();
    console.log('✅ Topics found:', topics.length);
    return sequelize;
  } catch (e) {
    console.error(e);
  }

  return null;
}
