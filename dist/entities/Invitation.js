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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invitation = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Invitation = class Invitation extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Invitation.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Invitation.prototype, "requester", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Invitation.prototype, "matchType", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Invitation.prototype, "requestee", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Invitation.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1.User, user => user.invitations),
    __metadata("design:type", Array)
], Invitation.prototype, "users", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Invitation.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Invitation.prototype, "updatedAt", void 0);
Invitation = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity(),
    typeorm_1.Index(["requester", "requestee"], { unique: true })
], Invitation);
exports.Invitation = Invitation;
//# sourceMappingURL=Invitation.js.map