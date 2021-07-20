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
exports.InvitationResolver = void 0;
const Invitation_1 = require("../entities/Invitation");
const User_1 = require("../entities/User");
const FieldError_1 = require("../objectTypes/FieldError");
const type_graphql_1 = require("type-graphql");
let InvitationResponse = class InvitationResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], InvitationResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Invitation_1.Invitation, { nullable: true }),
    __metadata("design:type", Invitation_1.Invitation)
], InvitationResponse.prototype, "invitation", void 0);
InvitationResponse = __decorate([
    type_graphql_1.ObjectType()
], InvitationResponse);
let InvitationResolver = class InvitationResolver {
    invitations({ req }) {
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
                relations: ['invitations'],
                where: { id: req.session.userId }
            });
            const map = requests.map(req => req.invitations);
            return map.flat();
        });
    }
    respondToInvitation(requestId, response, { req }) {
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
            const user = yield User_1.User.findOne({ where: { id: req.session.userId } });
            const request = yield Invitation_1.Invitation.findOne({ where: { id: requestId } });
            if (!request || !user) {
                return {
                    errors: [
                        {
                            field: 'requestId',
                            message: 'request does not exist or current user does not exist'
                        }
                    ]
                };
            }
            if (request.requestee !== user.username) {
                return {
                    errors: [
                        {
                            field: 'requestId',
                            message: 'Current user was not the target of the request'
                        }
                    ]
                };
            }
            if (Date.now() - request.createdAt.valueOf() > 60000) {
                Invitation_1.Invitation.remove(request);
                return {
                    errors: [
                        {
                            field: "requestId",
                            message: "this request has expired"
                        }
                    ]
                };
            }
            if (response) {
                request.status = 1;
            }
            else {
                request.status = -1;
            }
            Invitation_1.Invitation.save(request);
            return { invitation: request };
        });
    }
    createInvitation(username, { req }) {
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
                            message: 'you do not exist'
                        }
                    ]
                };
            }
            const request = Invitation_1.Invitation.create({ requester: requester.username, status: 0, requestee: requestee.username, users: [requester, requestee], matchType: 1 }).save();
            return { invitation: request };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Invitation_1.Invitation]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitationResolver.prototype, "invitations", null);
__decorate([
    type_graphql_1.Mutation(() => InvitationResponse),
    __param(0, type_graphql_1.Arg("requestId")),
    __param(1, type_graphql_1.Arg("response")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], InvitationResolver.prototype, "respondToInvitation", null);
__decorate([
    type_graphql_1.Mutation(() => InvitationResponse),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationResolver.prototype, "createInvitation", null);
InvitationResolver = __decorate([
    type_graphql_1.Resolver()
], InvitationResolver);
exports.InvitationResolver = InvitationResolver;
//# sourceMappingURL=invitation.js.map