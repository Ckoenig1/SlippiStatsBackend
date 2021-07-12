"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestResolver = void 0;
const FriendRequest_1 = require("../entities/FriendRequest");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("../objectTypes/FieldError");
let FriendResponse = class FriendResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], FriendResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => FriendRequest_1.FriendRequest, { nullable: true }),
    __metadata("design:type", FriendRequest_1.FriendRequest)
], FriendResponse.prototype, "friendRequest", void 0);
FriendResponse = __decorate([
    type_graphql_1.ObjectType()
], FriendResponse);
let FriendRequestResolver = class FriendRequestResolver {
    getFriendRequests({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return {
                    errors: [
                        {
                            field: 'user',
                            message: 'you are not logged in'
                        }
                    ]
                };
            }
            const requests = yield User_1.User.find({
                relations: ['friendRequests'],
                where: { id: req.session.userId }
            });
            const map = requests.map(req => req.friendRequests);
            return map.flat();
        });
    }
    createFriendRequest(username, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return {
                    errors: [
                        {
                            field: 'user',
                            message: 'you are not logged in'
                        }
                    ]
                };
            }
            const requester = yield User_1.User.findOne(req.session.userId);
            const requestee = yield User_1.User.findOne({ where: { username: username } });
            if (!requestee) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'that user doesnt exist'
                        }
                    ]
                };
            }
            if (!requester) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'you are not logged in'
                        }
                    ]
                };
            }
            const request = FriendRequest_1.FriendRequest.create({ requester: requester.username, requestee: requestee.username, users: [requester, requestee] }).save();
            return { friendRequest: request };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [FriendRequest_1.FriendRequest]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendRequestResolver.prototype, "getFriendRequests", null);
__decorate([
    type_graphql_1.Mutation(() => FriendResponse),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FriendRequestResolver.prototype, "createFriendRequest", null);
FriendRequestResolver = __decorate([
    type_graphql_1.Resolver()
], FriendRequestResolver);
exports.FriendRequestResolver = FriendRequestResolver;
//# sourceMappingURL=friendRequest.js.map