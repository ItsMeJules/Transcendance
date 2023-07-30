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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkController = void 0;
var common_1 = require("@nestjs/common");
var guard_1 = require("../auth/guard");
var BookmarkController = exports.BookmarkController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(guard_1.JwtGuard), (0, common_1.Controller)('bookmark')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getBookmarks_decorators;
    var _getBookmarkById_decorators;
    var _createBookmarks_decorators;
    var _editBookmarkById_decorators;
    var _deleteBookmarkById_decorators;
    var BookmarkController = _classThis = /** @class */ (function () {
        function BookmarkController_1(bookmarkService) {
            this.bookmarkService = (__runInitializers(this, _instanceExtraInitializers), bookmarkService);
        }
        BookmarkController_1.prototype.getBookmarks = function (userId) {
            return this.bookmarkService.getBookmarks(userId);
        };
        BookmarkController_1.prototype.getBookmarkById = function (userId, bookmarkId) {
            return this.bookmarkService.getBookmarkById(userId, bookmarkId);
        };
        BookmarkController_1.prototype.createBookmarks = function (userId, dto) {
            return this.bookmarkService.createBookmarks(userId, dto);
        };
        BookmarkController_1.prototype.editBookmarkById = function (userId, bookmarkId, dto) {
            return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
        };
        BookmarkController_1.prototype.deleteBookmarkById = function (userId, bookmarkId) {
            return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
        };
        return BookmarkController_1;
    }());
    __setFunctionName(_classThis, "BookmarkController");
    (function () {
        _getBookmarks_decorators = [(0, common_1.Get)()];
        _getBookmarkById_decorators = [(0, common_1.Get)(':id')];
        _createBookmarks_decorators = [(0, common_1.Post)()];
        _editBookmarkById_decorators = [(0, common_1.Patch)(':id')];
        _deleteBookmarkById_decorators = [(0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, common_1.Delete)(':id')];
        __esDecorate(_classThis, null, _getBookmarks_decorators, { kind: "method", name: "getBookmarks", static: false, private: false, access: { has: function (obj) { return "getBookmarks" in obj; }, get: function (obj) { return obj.getBookmarks; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBookmarkById_decorators, { kind: "method", name: "getBookmarkById", static: false, private: false, access: { has: function (obj) { return "getBookmarkById" in obj; }, get: function (obj) { return obj.getBookmarkById; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBookmarks_decorators, { kind: "method", name: "createBookmarks", static: false, private: false, access: { has: function (obj) { return "createBookmarks" in obj; }, get: function (obj) { return obj.createBookmarks; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editBookmarkById_decorators, { kind: "method", name: "editBookmarkById", static: false, private: false, access: { has: function (obj) { return "editBookmarkById" in obj; }, get: function (obj) { return obj.editBookmarkById; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteBookmarkById_decorators, { kind: "method", name: "deleteBookmarkById", static: false, private: false, access: { has: function (obj) { return "deleteBookmarkById" in obj; }, get: function (obj) { return obj.deleteBookmarkById; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        BookmarkController = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookmarkController = _classThis;
}();
