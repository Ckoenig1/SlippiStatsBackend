
import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {  COOKIE_NAME } from "../constants";
import { getConnection } from "typeorm";
import { InputType, Field, ObjectType, Query, Ctx, Arg, Mutation, Resolver } from "type-graphql";

@InputType()
class UsernamePasswordInput{
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

  

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {

    @Query(() => User, {nullable: true})
     me(
        @Ctx() { req }: MyContext
    ){
        // you are not logged
        if (!req.session.userId){
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Query(()=> Boolean)
    async online(@Arg('username') user : string ){
        let foundUser = await User.findOne({where:{username: user}})
        if(foundUser){
            return foundUser.online
        }
        else{
            return false;
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options : UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse>{
        if(options.username.length <= 2){
            return{
                errors: [
                    {
                        field: 'username',
                        message: 'length must be greater than 2'
                    }
                ]
            }
        }
        if(options.password.length <= 4){
            return{
                errors: [
                    {
                        field: 'password',
                        message: 'length must be greater than 4'
                    }
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        // const user = em.create(User,{
        //     username: options.username,
        //     password: hashedPassword,
        // });
        let user;
        try{
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                username: options.username,
                password: hashedPassword,
            })
            .returning("*")
            .execute();
            user = result.raw[0];
        } catch(err){
            if(err.code === "23505"){
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        }
                    ]
                }
            }
        }
        
        req.session.userId = user.id;
        return {
            user
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options : UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse>{
        const user = await User.findOne({where: {username: options.username}});
        if(!user){
            return{
                errors: [
                    {
                    field: 'username',
                    message: "that username doesn't exist",
                    }
                ],
            }
        }
        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    }
                ]
            }
        }

        req.session.userId = user.id;
        User.update(user,{online: true})
        console.log(req.session.userId)
        console.log(req.session)

        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(COOKIE_NAME);
            if(err){
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }))
    }
}