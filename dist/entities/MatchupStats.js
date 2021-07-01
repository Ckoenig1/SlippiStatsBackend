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
exports.MatchupStats = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let MatchupStats = class MatchupStats extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "charId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], MatchupStats.prototype, "opponentCode", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "stageID", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "userCodeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.matchupStats),
    typeorm_1.JoinColumn({ name: "userCodeId" }),
    __metadata("design:type", User_1.User)
], MatchupStats.prototype, "userCode", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "wins", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "losses", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "totalGames", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "incompleteGames", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "timePlayed", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "kills", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "deaths", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "selfDestructs", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "killDeath", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "averageSDs", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "apm", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "openingsPerKill", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], MatchupStats.prototype, "avgKillPercent", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "comeBack2", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "comeBack3", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "comeBack4", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchupStats.prototype, "fourStocks", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], MatchupStats.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], MatchupStats.prototype, "updatedAt", void 0);
MatchupStats = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], MatchupStats);
exports.MatchupStats = MatchupStats;
//# sourceMappingURL=MatchupStats.js.map