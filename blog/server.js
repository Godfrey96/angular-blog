import express from 'express'
import path from 'path'
import multer from 'multer'
import colors from 'colors'
import { config } from 'dotenv'
import morgan from 'morgan'
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import usersRoutes from './routes/usersRoutes.js';
// import postsRoutes from './routes/postsRoutes.js';
import postsRoutes from './routes/post.js';
import categoriesRoutes from './routes/categoriesRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

config();

const app = express()

app.use(cors());

if (process.env.MODE_ENV == 'development') {
    app.use(morgan('dev'))
}

app.use((express.json()))

connectDB();

app.get('/', (req, res) => {
    res.send('API is running...')
})

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename(req, file, cb) {
//         cb(null, req.body.name)
//     },
// })

// const upload = multer({ storage: storage })

// app.post('/api/uploads', upload.single('image'), (req, res) => {
//     res.status(200).json("File has been uploaded");
// })

// users routes
app.use('/api/users', usersRoutes);
// posts routes
app.use('/api/posts', postsRoutes);
// categories routes
app.use('/api/categories', categoriesRoutes);
// post image routes
app.use('/api/uploads', uploadRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))