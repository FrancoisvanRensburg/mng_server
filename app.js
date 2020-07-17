const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const registerRoutes = require('./routes/register');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const clientRoutes = require('./routes/client');
const projectRoutes = require('./routes/projects');
const TaskRoutes = require('./routes/tasks');

const app = express();

connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();
app.use(morgan('dev'));
app.use(bodyParser.json());

if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', TaskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
