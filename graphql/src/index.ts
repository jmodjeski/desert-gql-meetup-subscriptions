import { ApolloServer, gql, PubSub } from 'apollo-server';
import {prisma} from './generated/prisma-client';

// The GraphQL schema
const typeDefs = gql`
  type Message {
    content: String!
    scenario: String!
  }

  type Query {
    messages: [Message!]!
  }

  # type Mutation {
  #   # addMessage(comment: String!): Message
  # }

  type Subscription {
    # prisma(): Message
    pubsub(channel: String!): Message
  }
`;

const resolvers = {
  Query: {
    messages: () => []
  },
  // Mutation: {

  // },
  Subscription: {
    // prisma: {
    //   subscribe: prisma.$subscribe.message,
    // },
    pubsub: {
      subscribe: (parent: any, args: any) => {
        console.log(parent, args);
        return;
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(80, '0.0.0.0').then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
