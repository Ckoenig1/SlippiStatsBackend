
import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {  COOKIE_NAME } from "../constants";
import { getConnection, In } from "typeorm";
import { InputType, Field, ObjectType, Query, Ctx, Arg, Mutation, Resolver } from "type-graphql";
import { FieldError } from "../objectTypes/FieldError";

@InputType()
class UsernamePasswordInput{
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User ;
}

@ObjectType()
class UsersResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => [User], {nullable: true})
    users?: User[];
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

    @Query(() => UsersResponse)
    async getUsers(
        @Ctx() {req}: MyContext
    ):Promise<UsersResponse>{
        if(!req.session.userId){
            return {
                errors: [
                    {
                        field: 'user',
                        message: 'you are not logged in'
                    }
                ]
            };
        }
        
        const requests = await User.find({
            relations: ['friendRequests'],
            where: {id: req.session.userId}
        })
        let user = requests[0].username
        const map = requests.map(req => req.friendRequests)
        let friendReqs =  map.flat()
        let friends = friendReqs.map(req => {
            if(req.requestee === user){
                return req.requester
            }
            return req.requestee
        })
        let users = await User.find({where:{username: In(friends)}})
        console.log(users)
        return {users: users};
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
        @Arg('userCode') userCode: string,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse>{
        let regExp = /^[A-Za-z]+\#{1}\d+$/;
        if(!regExp.test(userCode)){
            return {
                errors: [
                    {
                        field: 'userCode',
                        message: 'Invalid connect code. Codes need to be in the form letters + # + numbers'
                    }
                ]
            }
        }
        if(options.username.length <= 2){
            return{
                errors: [
                    {
                        field: 'username',
                        message: 'Username length must be greater than 2'
                    }
                ]
            }
        }

        if(options.password.length <= 4){
            return{
                errors: [
                    {
                        field: 'password',
                        message: 'Password length must be greater than 4'
                    }
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
       
        let user;
        try{
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                username: options.username,
                password: hashedPassword,
                online: true,
                userCode: userCode.toUpperCase()
            })
            .returning("*")
            .execute();
            user = result.raw[0];
        } catch(err){
            if(err.code === "23505"){
                let detail = (err.detail.split("="))
                let userError = "Key (username)"
                console.log(detail[0])
                if(detail[0] == userError){
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "username already taken",
                            }
                        ]
                    }
                }
                else{ 
                    return {
                        errors: [
                            {
                                field: "userCode",
                                message: "That connect code is already taken",
                            }
                        ]
                    }
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
        user.online = true

        User.save(user)
        

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