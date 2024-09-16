require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dbConnect = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitizer = require('express-mongo-sanitize');


const port = process.env.PORT || 8000
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const reviewRouter = require('./routers/reviewRouter');
const orderRouter = require('./routers/orderRoutes');


const app = express();

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
}));

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitizer());

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', async (req, res) => {
    console.log(req.cookies);
    res.send('hello world');
});

app.get('/api/v2', async (req, res) => {
    console.log(req.signedCookies);
    res.send('hello world');
});

app.use('/api/v2/auth', authRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/products', productRouter);
app.use('/api/v2/reviews', reviewRouter);
app.use('/api/v2/orders', orderRouter);

//not found
app.use(notFound);
app.use(errorHandler);



start();

async function start() {
    try {
        await dbConnect(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })   
    } catch (error) {
        console.log.log(error);
    }
};