
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class MatchupStats extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn() 
    id!: number;

    @Field()
    @Column()
    charId: number;

    @Field()
    @Column()
    opponentCode: string;

    @Field()
    @Column()
    stageID: number;

    @Column()
    userCodeId: number;
    @ManyToOne(() => User, (user) => user.matchupStats)
    @JoinColumn({name : "userCodeId"})
    userCode: User;

    @Field()
    @Column()
    wins: number;

    @Field()
    @Column()
    losses: number;

    @Field()
    @Column()
    totalGames: number;

    @Field()
    @Column()
    incompleteGames: number;

    @Field()
    @Column("float")
    timePlayed: number;

    @Field()
    @Column()
    kills: number;

    @Field()
    @Column()
    deaths: number;

    @Field()
    @Column()
    selfDestructs: number;

    @Field()
    @Column("float") 
    killDeath: number;

    @Field()
    @Column("float")
    averageSDs: number;

    @Field()
    @Column("float")
    apm: number;

    @Field()
    @Column("float")
    openingsPerKill: number;

    @Field()
    @Column("float")
    avgKillPercent: number;

    @Field()
    @Column()
    comeBack2: number;

    @Field()
    @Column()
    comeBack3: number;

    @Field()
    @Column()
    comeBack4: number;

    @Field()
    @Column()
    fourStocks: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}