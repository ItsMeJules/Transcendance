import { extname } from 'path';
import { Profile } from 'passport-google-oauth20';
import { filesize } from 'filesize';
import * as fileType from 'file-type'; // Import the 'file-type' library


export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files (JPG, JPEG, PNG) are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const timestamp = new Date().getTime();
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const uniqueFileName = `${name}-${timestamp}-${randomName}${fileExtName}`;
  callback(null, uniqueFileName);
};

export const constructPictureUrl = (path: string) => {
  return process.env.API_BASE_URL + process.env.IMAGES_FOLDER + '/' + path;
};

export const constructPicturePath = (path: string) => {
  if (path.charAt(0) === '/')
    return (
      process.cwd() +
      process.env.PUBLIC_FOLDER +
      process.env.IMAGES_FOLDER +
      path
    );
  return (
    process.cwd() +
    process.env.PUBLIC_FOLDER +
    process.env.IMAGES_FOLDER +
    '/' +
    path
  );
};

export const constructPicturePathNoImage = (path: string) => {
  if (path.charAt(0) === '/')
    return process.cwd() + process.env.PUBLIC_FOLDER + path;
  return process.cwd() + process.env.PUBLIC_FOLDER + '/' + path;
};