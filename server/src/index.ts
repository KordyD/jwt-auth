import express from 'express';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '..', 'src', '.env') });
const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
