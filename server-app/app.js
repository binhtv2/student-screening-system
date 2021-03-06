const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const checkAuth = require('./middlewares/check-authentication');
const checkStudent = require('./middlewares/check-exam-token');
const checkRoleStaff = require('./middlewares/check-role-staff');
const checkRoleAdmin = require('./middlewares/check-role-admin');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');
const staffsRouter = require('./routes/staffs');
const adminsRouter = require('./routes/admin');

dotenv.config();
const {
	DB_USER: user,
	DB_PASS: password,
	DB_HOST: hostname,
	DB_NAME: database
} = process.env;
mongoose.connect(`mongodb://${user}:${password}@${hostname}/${database}`, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log('DB connection established');
	})
	.catch(() => {
		console.log('DB connection failed');
	});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', checkStudent, studentsRouter)
app.use('/staffs', checkAuth, checkRoleStaff, staffsRouter);
app.use('/admin', checkAuth, checkRoleAdmin, adminsRouter);

module.exports = app;