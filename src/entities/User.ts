import { CreateDateColumn,UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { MatchupStats } from "./MatchupStats";
import { FriendRequest } from "./FriendRequest";
import { Invitation } from "./Invitation";
@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username: string;

    @Field()
    @Column({unique: true})
    userCode: string;


    @Field(() => Boolean)
    @Column('boolean', {default: false})
    online: boolean = false;

    @Field(() => [FriendRequest])
    @ManyToMany(() => FriendRequest, friendRequest => friendRequest.users)
    @JoinTable()
    friendRequests: FriendRequest[];
    
    @Field(() => [Invitation])
    @ManyToMany(() => Invitation, invitation => invitation.users)
    @JoinTable()
    invitations: Invitation[];


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
