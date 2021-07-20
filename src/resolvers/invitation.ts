import { Invitation } from "../entities/Invitation";
import { User } from "../entities/User";
import { FieldError } from "../objectTypes/FieldError";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query,Resolver } from "type-graphql";



@ObjectType()
class InvitationResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Invitation, {nullable: true})
    invitation?: Invitation;
}


@Resolver()
export class InvitationResolver{
    @Query(() => [Invitation])
    async invitations(
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
            relations: ['invitations'],
            where: {id: req.session.userId}
        })
        const map = requests.map(req => req.invitations)
        
       
        return map.flat()
    }
    
    @Mutation(() => InvitationResponse)
    async respondToInvitation(
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
        const request = await Invitation.findOne({where:{id:requestId}})
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
        // is the invitation older than 5 minutes
        //300000
        if(Date.now() - request.createdAt.valueOf() > 60000 ){
            Invitation.remove(request)
            return {
                errors: [
                    {
                        field: "requestId",
                        message: "this request has expired"
                    }
                ]
            }
        }
        if(response){
            request.status = 1
        }
        else{
            request.status = -1
        }
        Invitation.save(request)
        return {invitation: request};
    }
    
    @Mutation(() => InvitationResponse)
    async createInvitation(
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
                        message: 'you do not exist'
                    }
                ]
            }
        }

        const request = Invitation.create({requester : requester.username, status: 0,requestee: requestee.username,users: [requester,requestee], matchType: 1}).save()
        return {invitation: request}
    }
}