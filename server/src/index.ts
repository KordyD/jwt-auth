import express from 'express';
import { config } from 'dotenv';
import { join } from 'path';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routers';
import { errorMiddleware } from './middlewares/error-middleware';

config({ path: join(__dirname, '..', 'src', '.env') });
const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
const app = express();

const start = async () => {
  try {
    if (mongoURL === undefined) {
      throw new Error('No db url');
    }
    await connect(mongoURL, { dbName: 'JWT-auth' });
  } catch (error) {
    console.log(error);
  }
};

start();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
