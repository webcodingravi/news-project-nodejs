import multer from 'multer'
import path from 'path'

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname));
    }
});


const fileFilter=(req, file, cb) => {
    if (file.mimetype==='image/jpeg'||file.mimetype==='image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'), false)
    }
};

const upload=multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

export default upload;