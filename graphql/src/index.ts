import { ApolloServer, gql } from 'apollo-server';

// The GraphQL schema
const typeDefs = gql`
  type Scenario {
    name: String!
    query: String!
  }

  type Query {
    "Scenarios to create configured subscriptions."
    scenarios: [Scenario!]!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    scenarios: () => [{
      name: 'Once a second',
      query: ''
    }, {
      name: 'Too Fast',
      query: ''
    }, {
      name: 'Redis PubSub',
      query: ''
    }],
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(80, '0.0.0.0').then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
