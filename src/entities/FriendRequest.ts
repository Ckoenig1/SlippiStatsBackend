import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";


@ObjectType()
@Entity()
@Index(["requester","requestee"],{unique:true})
export class FriendRequest extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number; 

    @Field()
    @Column()
    requester: String;

    @Field()
    @Column()
    requestee: String;

    // 1 - accepted 
    // 0 - pending
    // -1 - declined
    @Field()
    @Column()
    status: number

    @Field(() => [User])
    @ManyToMany(() => User, user => user.friendRequests)
    users: User[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}   