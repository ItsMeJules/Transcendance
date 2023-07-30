"use strict";
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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon = require("argon2");
var library_1 = require("@prisma/client/runtime/library");
var AuthService = exports.AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, config) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.config = config;
        }
        AuthService_1.prototype.login = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    payload = {
                        id: user.id,
                    };
                    return [2 /*return*/, this.jwtService.sign(payload)];
                });
            });
        };
        AuthService_1.prototype.signup = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var profilePictureUrl, absoluteUrl, hash, user, access_token, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            profilePictureUrl = '/images/logo.png';
                            absoluteUrl = this.config.get('API_BASE_URL') + "".concat(profilePictureUrl);
                            return [4 /*yield*/, argon.hash(dto.password)];
                        case 1:
                            hash = _a.sent();
                            if (dto.username.length > 100)
                                throw new common_1.ForbiddenException('Username too long');
                            else if (dto.password.length > 100)
                                throw new common_1.ForbiddenException('Password too long');
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email,
                                        username: dto.username,
                                        hash: hash,
                                        profilePicture: absoluteUrl,
                                        gamesPlayed: 0,
                                        gamesWon: 0,
                                        userPoints: 0,
                                        userLevel: 0,
                                    },
                                })];
                        case 3:
                            user = _a.sent();
                            access_token = this.signToken(user.id, user.email);
                            return [2 /*return*/, this.signToken(user.id, user.email)];
                        case 4:
                            error_1 = _a.sent();
                            if (error_1 instanceof library_1.PrismaClientKnownRequestError) {
                                if (error_1.code === 'P2002') {
                                    // Add more errors handlers or a default one?
                                    throw new common_1.ForbiddenException('Credentials taken');
                                }
                            }
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.signin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, pwMatches;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: {
                                    email: dto.email,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user || user.hash === '')
                                throw new common_1.ForbiddenException('Credentials incorrect');
                            return [4 /*yield*/, argon.verify(user.hash, dto.password)];
                        case 2:
                            pwMatches = _a.sent();
                            if (!pwMatches)
                                throw new common_1.ForbiddenException('Credentials incorrect');
                            return [2 /*return*/, this.signToken(user.id, user.email)];
                    }
                });
            });
        };
        AuthService_1.prototype.signToken = function (userId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, secret, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                id: userId,
                                email: email,
                            };
                            secret = process.env.jwtSecret;
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    expiresIn: '30m',
                                    secret: secret,
                                })];
                        case 1:
                            token = _a.sent();
                            return [2 /*return*/, token];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
