import express from 'express';
import { requestLogger } from './middleware/request-logger.js';
import helloRouter from './routes/hello.routes.js';
import productRouter from './routes/product.routes.js';

const app = express();

// Global Middleware
app.use(express.json());
app.use(requestLogger);

// Endpoint Routing
app.use('/hello', helloRouter);

app.use('/products', productRouter );
export default app;