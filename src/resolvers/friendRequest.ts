import { FriendRequest } from "../entities/FriendRequest";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType,Query,Resolver } from "type-graphql";
import { FieldError } from "../objectTypes/FieldError";





@ObjectType()
class FriendResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => FriendRequest, {nullable: true})
    friendRequest?: FriendRequest;
}


@Resolver()
export class FriendRequestResolver {

    @Query(() => [FriendRequest])
    async getFriendRequests(
        @Ctx()
        {req}: MyContext
    ){
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
        const map = requests.map(req => req.friendRequests)
        
       
        return map.flat()
    }  

    @Mutation(() => FriendResponse)
    async respondToFriendRequest(
        @Arg("requestId")
        requestId: number,
        @Arg("response")
        response: boolean,
        @Ctx()
        {req}: MyContext
    ){
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
        const user = await User.findOne({where:{id:req.session.userId}})
        const request = await FriendRequest.findOne({where:{id:requestId}})
        if(!request || !user){
            return {
                errors: [
                    {
                        field: 'requestId',
                        message: 'request does not exist or current user does not exist'
                    }
                ]
            };
        }
        if(request.requestee !== user.username){
            return {
                errors: [
                    {
                        field: 'requestId',
                        message: 'Current user was not the target of the request'
                    }
                ]
            };
        }
        request.status = response
        FriendRequest.save(request)
        return request;
    }
    
    @Mutation(() => FriendResponse)
    async createFriendRequest(
        @Arg("username")
        username:string,
        @Ctx()
        {req}: MyContext
    ){
        if (!req.session.userId){
            return {
                errors: [
                    {
                        field: 'user',
                        message: 'you are not logged in'
                    }
                ]
            };
            
        }
        const requester = await User.findOne(req.session.userId);
        const requestee = await User.findOne({where: {username: username}})
        if(!requestee){
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'that user doesnt exist'
                    }
                ]
            }
        }
        if(!requester){
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'you are not logged in'
                    }
                ]
            }
        }

        const request = FriendRequest.create({requester : requester.username, requestee: requestee.username,users: [requester,requestee]}).save()
        return {friendRequest:request}
    }
}