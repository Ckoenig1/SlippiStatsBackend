import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import express from "express";
import {ApolloServer}  from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from'express-session';
import connectRedis from 'connect-redis';
import {createConnection} from 'typeorm'
import { User } from "./entities/User";
import { MatchupStats } from "./entities/MatchupStats";
import cors from "cors";
import { StatResolver } from "./resolvers/stats";




const main = async () => {
     await createConnection({
        type: 'postgres',
        database: 'statsdb',
        username: 'postgres',
        password: 'Cades2010',
        port: 5432,
        logging: true,
        synchronize: true,
        entities: [Post,User,MatchupStats]
    }).catch((err) => console.log(err))
    //await orm.getMigrator().up(); 
    const app = express();
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(
        session({
            name:COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 *24 *365 * 10,
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__, // cookie will only work in https
            },
            saveUninitialized: false,
            secret: "hidethis",
            resave: false,
        })
    )
   
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver,PostResolver,UserResolver,StatResolver],
            validate: false,
        }),
        context: ({req, res}) => ({req, res})
    }); 

    apolloServer.applyMiddleware({
        app,
        cors: false,
        });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
    // const post = orm.em.create(Post, {title: 'my first post'});
    // await orm.em.persistAndFlush(post);
    //const posts = await Post.find({});
    //console.log(posts);    
}
main();
