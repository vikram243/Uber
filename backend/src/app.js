// backend/src/app.js
import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './utils/error.js';
import router from './routes/index.js';


const app = express();


// Trust proxies if behind Render/NGINX
app.set('trust proxy', 1);


// Security & perf middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(compression());


// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));


// Basic request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}


// Rate limiting (tune to your needs)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false });
app.use('/api', limiter);


// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, env: process.env.NODE_ENV || 'dev', uptime: process.uptime() });
});


// API routes
app.use('/api', router);


// 404 & Error handlers (keep last)
app.use(notFound);
app.use(errorHandler);


export default app;