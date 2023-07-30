"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var guard_1 = require("../auth/guard");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var module_1 = require("./module");
var UserController = exports.UserController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(guard_1.JwtGuard), (0, common_1.Controller)('users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMe_decorators;
    var _findAll_decorators;
    var _editUser_decorators;
    var _uploadProfilePic_decorators;
    var _logout_decorators;
    var UserController = _classThis = /** @class */ (function () {
        function UserController_1(userService) {
            this.userService = (__runInitializers(this, _instanceExtraInitializers), userService);
        }
        UserController_1.prototype.getMe = function (user) {
            // console.log('USERRRRRRRRRR:', user);
            return user;
        };
        UserController_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userService.findAll()];
                });
            });
        };
        UserController_1.prototype.editUser = function (userId, dto) {
            return this.userService.editUser(userId, dto);
        };
        UserController_1.prototype.uploadProfilePic = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userService.uploadProfilePic(user, file)];
                });
            });
        };
        // @Get('get-profile-picture')
        // sendProfilePicToFront(@GetUser() user: User, @Req() req: Request) {
        //     const baseUrl = `${req.protocol}://${req.get('host')}`;
        //     const profilePictureUrl = '/images/selfie.jpg';
        //     const absoluteUrl = `${baseUrl}${profilePictureUrl}`;
        //     console.log(absoluteUrl);
        //     return absoluteUrl;
        // }
        UserController_1.prototype.logout = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    res.clearCookie('access_token');
                    res.json({ message: 'Logout successful' });
                    return [2 /*return*/];
                });
            });
        };
        return UserController_1;
    }());
    __setFunctionName(_classThis, "UserController");
    (function () {
        _getMe_decorators = [(0, common_1.Get)('me')];
        _findAll_decorators = [(0, common_1.Get)('all')];
        _editUser_decorators = [(0, common_1.Patch)()];
        _uploadProfilePic_decorators = [(0, common_1.Post)('pf'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
                storage: (0, multer_1.diskStorage)({
                    destination: 'public/images/',
                    filename: module_1.editFileName,
                }),
                fileFilter: module_1.imageFileFilter
            }))];
        _logout_decorators = [(0, common_1.Post)('logout')];
        __esDecorate(_classThis, null, _getMe_decorators, { kind: "method", name: "getMe", static: false, private: false, access: { has: function (obj) { return "getMe" in obj; }, get: function (obj) { return obj.getMe; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editUser_decorators, { kind: "method", name: "editUser", static: false, private: false, access: { has: function (obj) { return "editUser" in obj; }, get: function (obj) { return obj.editUser; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadProfilePic_decorators, { kind: "method", name: "uploadProfilePic", static: false, private: false, access: { has: function (obj) { return "uploadProfilePic" in obj; }, get: function (obj) { return obj.uploadProfilePic; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UserController = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserController = _classThis;
}();
