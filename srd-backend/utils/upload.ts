// utils/upload.ts
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the uploads directory exists
fs.ensureDirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, Word documents, and text files are allowed.'), false);
    }
  },
});

// Middleware to handle file deletion for updates
export const handleFileUpload = (fieldName: string) => {
  const uploadMiddleware = upload.single(fieldName);
  return (req: any, res: any, next: any) => {
    uploadMiddleware(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // If it's an update and a new file is uploaded, delete the old one
      if (req.method === 'PUT' && req.file && req.body.oldFilePath) {
        const oldFilePath = path.join(process.cwd(), 'public', req.body.oldFilePath);
        if (fs.existsSync(oldFilePath)) {
          await fs.remove(oldFilePath);
        }
      }
      next();
    });
  };
};

// Function to delete a file
export const deleteFile = async (filePath: string) => {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  if (fs.existsSync(fullPath)) {
    await fs.remove(fullPath);
  }
};

export default upload;