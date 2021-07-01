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
exports.StatResolver = void 0;
const MatchupStats_1 = require("../entities/MatchupStats");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
let Stats = class Stats {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "charId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Stats.prototype, "opponentCode", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "stageID", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "wins", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "losses", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "totalGames", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "incompleteGames", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "timePlayed", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "kills", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "deaths", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "selfDestructs", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "killDeath", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "averageSDs", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "apm", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "openingsPerKill", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "avgKillPercent", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "comeBack2", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "comeBack3", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "comeBack4", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Stats.prototype, "fourStocks", void 0);
Stats = __decorate([
    type_graphql_1.InputType()
], Stats);
;
let StatResolver = class StatResolver {
    updateStats(stats, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.session.userId);
            console.log(req.session);
            const newStats = yield MatchupStats_1.MatchupStats.findOne({ where: { userCodeId: req.session.userId, opponentCode: stats.opponentCode, stageID: stats.stageID, charId: stats.charId } });
            const user = yield User_1.User.findOne(req.session.userId);
            if (user) {
                if (!newStats) {
                    return yield MatchupStats_1.MatchupStats.create(Object.assign(Object.assign({}, stats), { userCode: user })).save();
                }
                if (typeof stats !== 'undefined') {
                    yield MatchupStats_1.MatchupStats.update(newStats, Object.assign({}, stats));
                }
                return newStats;
            }
            return false;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => MatchupStats_1.MatchupStats),
    __param(0, type_graphql_1.Arg('stats')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Stats, Object]),
    __metadata("design:returntype", Promise)
], StatResolver.prototype, "updateStats", null);
StatResolver = __decorate([
    type_graphql_1.Resolver()
], StatResolver);
exports.StatResolver = StatResolver;
//# sourceMappingURL=stats.js.map