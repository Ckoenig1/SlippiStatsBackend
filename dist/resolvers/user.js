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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("../objectTypes/FieldError");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UsersResponse = class UsersResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UsersResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => [User_1.User], { nullable: true }),
    __metadata("design:type", Array)
], UsersResponse.prototype, "users", void 0);
UsersResponse = __decorate([
    type_graphql_1.ObjectType()
], UsersResponse);
let UserResolver = class UserResolver {
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return User_1.User.findOne(req.session.userId);
    }
    getUsers({ req }) {
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
            let user = requests[0].username;
            const map = requests.map(req => req.friendRequests);
            let friendReqs = map.flat();
            let friends = friendReqs.map(req => {
                if (req.requestee === user) {
                    return req.requester;
                }
                return req.requestee;
            });
            let users = yield User_1.User.find({ where: { username: typeorm_1.In(friends) } });
            console.log(users);
            return { users: users };
        });
    }
    online(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundUser = yield User_1.User.findOne({ where: { username: user } });
            if (foundUser) {
                return foundUser.online;
            }
            else {
                return false;
            }
        });
    }
    register(options, userCode, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let regExp = /^[A-Za-z]+\#{1}\d+$/;
            if (!regExp.test(userCode)) {
                return {
                    errors: [
                        {
                            field: 'userCode',
                            message: 'Invalid connect code. Codes need to be in the form letters + # + numbers'
                        }
                    ]
                };
            }
            if (options.username.length <= 2) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username length must be greater than 2'
                        }
                    ]
                };
            }
            if (options.password.length <= 4) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Password length must be greater than 4'
                        }
                    ]
                };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            let user;
            try {
                const result = yield typeorm_1.getConnection().createQueryBuilder().insert().into(User_1.User).values({
                    username: options.username,
                    password: hashedPassword,
                    online: true,
                    userCode: userCode.toUpperCase()
                })
                    .returning("*")
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                if (err.code === "23505") {
                    let detail = (err.detail.split("="));
                    let userError = "Key (username)";
                    console.log(detail[0]);
                    if (detail[0] == userError) {
                        return {
                            errors: [
                                {
                                    field: "username",
                                    message: "username already taken",
                                }
                            ]
                        };
                    }
                    else {
                        return {
                            errors: [
                                {
                                    field: "userCode",
                                    message: "That connect code is already taken",
                                }
                            ]
                        };
                    }
                }
            }
            req.session.userId = user.id;
            return {
                user
            };
        });
    }
    login(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username: options.username } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: "that username doesn't exist",
                        }
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password",
                        }
                    ]
                };
            }
            req.session.userId = user.id;
            user.online = true;
            User_1.User.save(user);
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => UsersResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    type_graphql_1.Query(() => Boolean),
    __param(0, type_graphql_1.Arg('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "online", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Arg('userCode')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map