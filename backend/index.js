const express = require('express')
const app = express()
const bcrypt = require('bcryptjs');
const path = require('path');
bodyParser = require('body-parser');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const cors = require('cors');

const crypto = require('crypto')

const { adminRoutes } = require('./routes/admin.js');
const { vendorRoutes } = require('./routes/vendor.js');
const { logisticRoutes } = require('./routes/logistic.js');
const { userRoutes } = require('./routes/user.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');
const helmet = require('helmet');

const filesPath = path.resolve(__dirname, 'files');
app.use('/uploads', express.static(filesPath));
app.set('trust proxy', true);
const publiccPath = path.resolve(__dirname, 'public');
app.use('/', express.static(publiccPath));
app.use(bodyParser({ limit: '100mb' }));
app.use(sessionMiddleware);
app.use(express.json());
app.use(cookieParser())

//security
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

app.use(
  cors({
    origin: 'https://admin.dagstechnology.in',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);
database.connect();

app.use("/admin/api", adminRoutes);
app.use("/client/api", userRoutes);
app.use("/vendor/api", vendorRoutes);
app.use("/logistic/api", logisticRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running at port ${process.env.PORT}`)
})
