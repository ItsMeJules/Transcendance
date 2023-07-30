"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructPicturePathNoImage = exports.constructPicturePath = exports.constructPictureUrl = exports.editFileName = exports.imageFileFilter = void 0;
var path_1 = require("path");
var filesize_1 = require("filesize");
var imageFileFilter = function (req, file, callback) {
    console.log('File size:', file.size);
    console.log('Original name:', file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    var maxSize = 10 * 1000 * 1000; // 10MB in bytes
    console.log("File size:", file.size);
    if (file.size > maxSize) {
        return callback(new Error("File size exceeds the limit of ".concat((0, filesize_1.filesize)(maxSize), ".")), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
var editFileName = function (req, file, callback) {
    var name = file.originalname.split('.')[0];
    var fileExtName = (0, path_1.extname)(file.originalname);
    var timestamp = new Date().getTime();
    var randomName = Array(4)
        .fill(null)
        .map(function () { return Math.round(Math.random() * 16).toString(16); })
        .join('');
    var uniqueFileName = "".concat(name, "-").concat(timestamp, "-").concat(randomName).concat(fileExtName);
    callback(null, uniqueFileName);
};
exports.editFileName = editFileName;
var constructPictureUrl = function (path) {
    return process.env.API_BASE_URL + process.env.IMAGES_FOLDER + '/' + path;
};
exports.constructPictureUrl = constructPictureUrl;
var constructPicturePath = function (path) {
    if (path.charAt(0) === '/')
        return (process.cwd() +
            process.env.PUBLIC_FOLDER +
            process.env.IMAGES_FOLDER +
            path);
    return (process.cwd() +
        process.env.PUBLIC_FOLDER +
        process.env.IMAGES_FOLDER +
        '/' +
        path);
};
exports.constructPicturePath = constructPicturePath;
var constructPicturePathNoImage = function (path) {
    if (path.charAt(0) === '/')
        return process.cwd() + process.env.PUBLIC_FOLDER + path;
    return process.cwd() + process.env.PUBLIC_FOLDER + '/' + path;
};
exports.constructPicturePathNoImage = constructPicturePathNoImage;
