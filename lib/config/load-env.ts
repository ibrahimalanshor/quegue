import path from 'path';

const requireDotenv: string[] = ['development'];
const nodeEnv = process.env.NODE_ENV || 'development';

if (requireDotenv.includes(nodeEnv)) {
  require('dotenv').config({
    path: path.resolve(__dirname, `../../.env.${nodeEnv}`),
  });
}
