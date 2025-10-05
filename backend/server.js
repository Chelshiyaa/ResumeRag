require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const resumesRouter = require('./routes/resumes');
const jobsRouter = require('./routes/jobs');

const app = express();

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  'http://localhost:5173', // local dev frontend
  'https://resume-rag-amber.vercel.app' // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ---------- MIDDLEWARE ----------
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- CONNECT TO DB ----------
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resumerag';
connectDB(MONGO_URI);

// ---------- ROUTES ----------
app.use('/api/resumes', resumesRouter);
app.use('/api/jobs', jobsRouter);

// ---------- STATIC UPLOADS ----------
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIR)));

// ---------- HEALTH CHECK ----------
app.get('/', (req, res) => res.json({ ok: true }));

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`Uploads directory: ${UPLOAD_DIR}`);
});
