import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Serverrr');
});

import usersRouter from './src/users/router';
app.use('/users', usersRouter);

import authRouter from './src/auth/router';
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});