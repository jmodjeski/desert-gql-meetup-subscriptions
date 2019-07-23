import { ApolloServer, gql, PubSub } from 'apollo-server';
import {prisma} from './generated/prisma-client';

const channels = new PubSub();
const channelRegistry = {};

// The GraphQL schema
const typeDefs = gql`
  type Message {
    content: String!
    scenario: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    # addMessage(comment: String!): Message
    createChannel(channel: String!, intervalMs: Int!) : String
    destroyChannel(channel: String!) : String
  }

  type Subscription {
    # prisma(): Message
    pubsub(channel: String!): Message
  }
`;

const resolvers = {
  Query: {
    messages: () => []
  },
  Mutation: {
    createChannel: (parent: any, args: {channel: string, intervalMs: number}) => {
      if (channelRegistry[args.channel]) {
        throw new Error(`Channel Already Defined: ${args.channel}`)
      }
      let counter = 1;
      channelRegistry[args.channel] = setInterval(() => {
        const msg = {
          content: `Message ${counter++}`,
          scenario: 'PubSub'
        };
        console.log('publishing', args.channel, msg);
        channels.publish(args.channel, {pubsub: msg});
      }, args.intervalMs);
      return args.channel;
    },
    destroyChannel: (parent: any, args: {channel: string}) => {
      if (!channelRegistry[args.channel]) {
        throw new Error(`Channel Not Defined: ${args.channel}`)
      }
      clearInterval(channelRegistry[args.channel]);
      delete channelRegistry[args.channel];
      return args.channel;
    },
  },
  Subscription: {
    // prisma: {
    //   subscribe: prisma.$subscribe.message,
    // },
    pubsub: {
      subscribe: (parent: any, args: {channel: string}) => {
        return channels.asyncIterator([args.channel]);
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: '/'
});

server.listen(80, '0.0.0.0').then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
