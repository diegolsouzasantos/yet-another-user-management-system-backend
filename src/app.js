const express = require('express');
const cors = require('cors');
const corsOrigins = require('./config/cors-origins');
const routes = require('./routes');
const notFound = require('./middleware/not-found.middleware');
const errorHandler = require('./middleware/error-handler.middleware');
const locale = require('./middleware/locale.middleware');
const mountSwagger = require('./swagger/swagger.routes');

const app = express();

app.use(cors({ origin: corsOrigins, credentials: true, exposedHeaders: ['Content-Disposition'] }));
app.use(express.json());
app.use(locale);

mountSwagger(app);
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
