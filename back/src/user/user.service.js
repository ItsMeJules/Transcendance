"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var url_1 = require("url");
var library_1 = require("@prisma/client/runtime/library");
var sharp_1 = require("sharp");
var module_1 = require("./module");
var MAX_FILE_SIZE = 1000 * 1000 * 10; // 1 MB (you can adjust this value as needed)
var UserService = exports.UserService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UserService = _classThis = /** @class */ (function () {
        function UserService_1(prisma, config) {
            this.prisma = prisma;
            this.config = config;
        }
        UserService_1.prototype.editUser = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log(dto.username.length);
                            if (dto.username.length > 100)
                                throw new common_1.ForbiddenException('Username too long');
                            else if (dto.firstName.length > 100)
                                throw new common_1.ForbiddenException('First name too long');
                            else if (dto.lastName.length > 100)
                                throw new common_1.ForbiddenException('Last name too long');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: {
                                        id: userId,
                                    },
                                    data: __assign({}, dto),
                                })];
                        case 2:
                            user = _a.sent();
                            if (user)
                                delete user.hash;
                            return [2 /*return*/, user];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof library_1.PrismaClientKnownRequestError) {
                                if (error_1.code === 'P2002') {
                                    // Add more errors handlers or a default one?
                                    throw new common_1.ForbiddenException('Username taken');
                                }
                            }
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findMany()];
                });
            });
        };
        UserService_1.prototype.uploadProfilePic = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                var response, oldPictureObj, newPicPath, newPicUrl, compressionOptions, err_1, pathToDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            response = {
                                originalname: file.originalname,
                                filename: file.filename,
                            };
                            oldPictureObj = new url_1.URL(user.profilePicture);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            newPicPath = (0, module_1.constructPicturePath)('cmp_' + response.filename);
                            console.log(newPicPath);
                            newPicUrl = (0, module_1.constructPictureUrl)('cmp_' + response.filename);
                            compressionOptions = {
                                quality: 50, // Adjust the quality as needed (0 - 100)
                            };
                            return [4 /*yield*/, (0, sharp_1.default)(file.path).jpeg(compressionOptions).toFile(newPicPath)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: {
                                        id: user.id,
                                    },
                                    data: {
                                        profilePicture: newPicUrl,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            // Delete imported file
                            fs.unlinkSync(file.path);
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            throw new common_1.InternalServerErrorException('Failed to compress the image.');
                        case 5:
                            // Delete the previous profile picture from the file system
                            try {
                                console.log(oldPictureObj.pathname);
                                pathToDelete = (0, module_1.constructPicturePathNoImage)(oldPictureObj.pathname);
                                // console.log('Del 2:', pathToDelete);
                                if (pathToDelete &&
                                    oldPictureObj.pathname !==
                                        (0, module_1.constructPicturePath)(process.env.DEFAULT_PROFILE_PICTURE)) {
                                    fs.unlinkSync(pathToDelete);
                                }
                            }
                            catch (err) { }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.createUser = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isUserNameTaken(data.username)];
                        case 1:
                            if (!!(_a.sent()))
                                return [2 /*return*/, null];
                            return [2 /*return*/, this.prisma.user.create({ data: data })];
                    }
                });
            });
        };
        UserService_1.prototype.isUserNameTaken = function (username) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({ where: { username: username } })];
                });
            });
        };
        UserService_1.prototype.isEmailTaken = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({ where: { email: email } })];
                });
            });
        };
        UserService_1.prototype.findOrCreateUserOAuth = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var user, usernameAvailable, modifiedUsername, userNameCheck, randomSuffix, createdUser, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isEmailTaken(data.email)];
                        case 1:
                            user = _a.sent();
                            if (user) {
                                return [2 /*return*/, user];
                            }
                            usernameAvailable = false;
                            modifiedUsername = data.username;
                            _a.label = 2;
                        case 2:
                            if (!!usernameAvailable) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.isUserNameTaken(modifiedUsername)];
                        case 3:
                            userNameCheck = _a.sent();
                            console.log('test:', userNameCheck);
                            if (!userNameCheck) {
                                usernameAvailable = true;
                            }
                            else {
                                randomSuffix = Math.floor(Math.random() * 9);
                                modifiedUsername = data.username + randomSuffix;
                            }
                            return [3 /*break*/, 2];
                        case 4:
                            data.username = modifiedUsername;
                            console.log('username:', data.username);
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.prisma.user.create({ data: data })];
                        case 6:
                            createdUser = _a.sent();
                            return [2 /*return*/, createdUser];
                        case 7:
                            error_2 = _a.sent();
                            if (error_2 instanceof library_1.PrismaClientKnownRequestError) {
                                if (error_2.code === 'P2002') {
                                    // Add more errors handlers or a default one?
                                    throw new common_1.ForbiddenException('Username taken');
                                }
                            }
                            throw error_2;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.findOneById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        return UserService_1;
    }());
    __setFunctionName(_classThis, "UserService");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
}();
