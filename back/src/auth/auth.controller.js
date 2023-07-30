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
exports.AuthController = void 0;
var guard_1 = require("./guard");
var common_1 = require("@nestjs/common");
var AuthController = exports.AuthController = function () {
    var _classDecorators = [(0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleSignup_decorators;
    var _signin_decorators;
    var _handle42Login_decorators;
    var _handle42Redirect_decorators;
    var _handleGoogleLogin_decorators;
    var _handleGoogleRedirect_decorators;
    var _test123_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        AuthController_1.prototype.handleSignup = function (dto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var access_token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.signup(dto)];
                        case 1:
                            access_token = _a.sent();
                            res.cookie('access_token', access_token, {
                                httpOnly: true,
                                maxAge: 60 * 60 * 24 * 10000,
                                sameSite: 'lax',
                            });
                            return [2 /*return*/, { message: 'Signup successful' }];
                    }
                });
            });
        };
        AuthController_1.prototype.signin = function (dto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var access_token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.signin(dto)];
                        case 1:
                            access_token = _a.sent();
                            res.cookie('access_token', access_token, {
                                httpOnly: true,
                                maxAge: 60 * 60 * 24 * 10000,
                                sameSite: 'lax',
                            });
                            return [2 /*return*/, { message: 'Signin successful' }];
                    }
                });
            });
        };
        AuthController_1.prototype.handle42Login = function () {
            return { msg: '42 Authentification' };
        };
        AuthController_1.prototype.handle42Redirect = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var access_token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.login(req.user /*, false*/)];
                        case 1:
                            access_token = _a.sent();
                            res.cookie('access_token', access_token, {
                                httpOnly: true,
                                maxAge: 60 * 60 * 24 * 10000,
                                sameSite: 'lax',
                            });
                            res.redirect('http://localhost:4000/profile/me');
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.handleGoogleLogin = function () {
        };
        AuthController_1.prototype.handleGoogleRedirect = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var access_token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.login(req.user /*, false*/)];
                        case 1:
                            access_token = _a.sent();
                            res.cookie('access_token', access_token, {
                                httpOnly: true,
                                maxAge: 60 * 60 * 24 * 10000,
                                sameSite: 'lax',
                            });
                            res.redirect('http://localhost:4000/profile/me');
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.test123 = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    res.json('good');
                    return [2 /*return*/];
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        _handleSignup_decorators = [(0, common_1.Post)('signup')];
        _signin_decorators = [(0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('signin')];
        _handle42Login_decorators = [(0, common_1.Get)('42/login'), (0, common_1.UseGuards)(guard_1.FortyTwoAuthGuard)];
        _handle42Redirect_decorators = [(0, common_1.Get)('42/redirect'), (0, common_1.UseGuards)(guard_1.FortyTwoAuthGuard)];
        _handleGoogleLogin_decorators = [(0, common_1.Get)('google/login'), (0, common_1.UseGuards)(guard_1.GoogleAuthGuard)];
        _handleGoogleRedirect_decorators = [(0, common_1.Get)('google/redirect'), (0, common_1.UseGuards)(guard_1.GoogleAuthGuard)];
        _test123_decorators = [(0, common_1.Get)('test123'), (0, common_1.UseGuards)(guard_1.JwtGuard)];
        __esDecorate(_classThis, null, _handleSignup_decorators, { kind: "method", name: "handleSignup", static: false, private: false, access: { has: function (obj) { return "handleSignup" in obj; }, get: function (obj) { return obj.handleSignup; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _signin_decorators, { kind: "method", name: "signin", static: false, private: false, access: { has: function (obj) { return "signin" in obj; }, get: function (obj) { return obj.signin; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handle42Login_decorators, { kind: "method", name: "handle42Login", static: false, private: false, access: { has: function (obj) { return "handle42Login" in obj; }, get: function (obj) { return obj.handle42Login; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handle42Redirect_decorators, { kind: "method", name: "handle42Redirect", static: false, private: false, access: { has: function (obj) { return "handle42Redirect" in obj; }, get: function (obj) { return obj.handle42Redirect; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGoogleLogin_decorators, { kind: "method", name: "handleGoogleLogin", static: false, private: false, access: { has: function (obj) { return "handleGoogleLogin" in obj; }, get: function (obj) { return obj.handleGoogleLogin; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGoogleRedirect_decorators, { kind: "method", name: "handleGoogleRedirect", static: false, private: false, access: { has: function (obj) { return "handleGoogleRedirect" in obj; }, get: function (obj) { return obj.handleGoogleRedirect; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _test123_decorators, { kind: "method", name: "test123", static: false, private: false, access: { has: function (obj) { return "test123" in obj; }, get: function (obj) { return obj.test123; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
