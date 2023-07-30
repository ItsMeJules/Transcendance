"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
var common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    return request.user;
});
