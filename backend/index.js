const express = require('express')
const bcrypt = require('bcryptjs');
const path = require('path');
bodyParser = require('body-parser');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const cors = require('cors');

const crypto = require('crypto')
const app = express()
const { adminRoutes } = require('./routes/admin.js');
const { vendorRoutes } = require('./routes/vendor.js');
const { logisticRoutes } = require('./routes/logistic.js');
const { userRoutes } = require('./routes/user.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');

const filesPath = path.resolve(__dirname, 'files');
app.use('/uploads', express.static(filesPath));
app.set('trust proxy', true);
const publiccPath = path.resolve(__dirname, 'public');
app.use('/', express.static(publiccPath));
app.use(bodyParser({ limit: '100mb' }));
app.use(sessionMiddleware);
app.use(express.json());
app.use(cookieParser())

const allowedDomains = ['https://dagstechnology.in', 'https://admin.dagstechnology.in/.'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors());
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
  // console.log(verifySignature("e6965afbe925d3bde4665de76c7c8231f22dd00d80fd468b31b031362f89c9c6","order_OSA0nrVnMXo6dI","pay_OSA1nRgIXkOgVi"))
  // razorpayOrderId = "order_OSA0nrVnMXo6dI"
  // paymentId= "pay_OSA1nRgIXkOgVi"
  // const secret = process.env.RAZORPAY_SECRET_KEY;
  // const generatedSignature = crypto.createHmac('sha256', secret)
  //     .update(razorpayOrderId + "|" + paymentId)
  //     .digest('hex');
  // console.log(generatedSignature==="e6965afbe925d3bde4665de76c7c8231f22dd00d80fd468b31b031362f89c9c6")
})
// require('./utils/user/cron-job.js')