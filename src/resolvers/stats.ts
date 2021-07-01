import { MatchupStats } from "../entities/MatchupStats";
import { User } from "../entities/User";
import {Resolver, Arg, Field, Mutation, Ctx, InputType} from "type-graphql";
import { MyContext } from "../types";

@InputType()
class Stats{
    @Field()
    charId: number;
    @Field()
    opponentCode: string;
    @Field()
    stageID: number;
    @Field()
    wins: number;
    @Field()
    losses: number;
    @Field()
    totalGames: number;
    @Field()
    incompleteGames: number;
    @Field()
    timePlayed: number;
    @Field()
    kills: number;
    @Field()
    deaths: number;
    @Field()
    selfDestructs: number;
    @Field() 
    killDeath: number;
    @Field()
    averageSDs: number;
    @Field()
    apm: number;
    @Field()
    openingsPerKill: number;
    @Field()
    avgKillPercent: number;
    @Field()
    comeBack2: number;
    @Field()
    comeBack3: number;
    @Field()
    comeBack4: number;
    @Field()
    fourStocks: number;
};

@Resolver()
export class StatResolver {

    @Mutation(() => MatchupStats)
    async updateStats(
        @Arg('stats') stats : Stats,
        @Ctx() {req}: MyContext,
    ): Promise<MatchupStats | Boolean>{
        console.log(req.session.userId)
        console.log(req.session)
        const newStats = await MatchupStats.findOne({where:{userCodeId: req.session.userId,opponentCode:stats.opponentCode,stageID: stats.stageID,charId: stats.charId}});
        const user = await User.findOne(req.session.userId)
        if(user){
            if(!newStats){
                return await MatchupStats.create({...stats, userCode: user}).save(); 
            }
            if(typeof stats !== 'undefined'){
                await MatchupStats.update(newStats,{...stats});
            }
            return  newStats
        }
        return false;
    }
}