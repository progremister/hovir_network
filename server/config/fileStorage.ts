import multer from "multer";
import { Callback } from 'mongoose';


const storage = multer.diskStorage({
    destination: (req, file, cb: Callback) => {
        cb(null, 'public/assets');
    },
    filename: (req, file: Express.Multer.File, cb: Callback) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

export default upload;