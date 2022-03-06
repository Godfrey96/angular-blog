import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        // cb(null, `${file.filename}-${Date.now()}${path.extname(file.originalname)}`)
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    },
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('image'), (req, res) => {
    // res.send(`/${req.file.path}`)
    // res.status(200).json('Image has been uploaded')
    res.send(`${req.file.path}`);
})

export default router

// const router = express.Router()

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename(req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         cb(null, `${fileName}-${Date.now()}`)
//     },
// })

// function checkFileType(file, cb) {
//     const filetypes = /jpg|jpeg|png/
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//     const mimetype = filetypes.test(file.mimetype)

//     if (extname && mimetype) {
//         return cb(null, true)
//     } else {
//         cb('Images only!')
//     }
// }

// const uploadOptions = multer({ storage: storage })

// router.post('/', uploadOptions.single('image'), (req, res) => {
//     res.status(200).json('Image has been uploaded')
// })

// export default router