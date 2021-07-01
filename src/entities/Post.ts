
import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
@ObjectType()
@Entity()
export class Post extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Column(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Column(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column({ type: 'text'})
    title!: string;
}