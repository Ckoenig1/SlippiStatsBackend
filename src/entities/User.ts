import { CreateDateColumn,UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { MatchupStats } from "./MatchupStats";
@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column()
    online: boolean;

    @OneToMany(() => MatchupStats, (stats) => stats.userCode)
    matchupStats: MatchupStats[];

    @Column()
    password!: string;
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}
