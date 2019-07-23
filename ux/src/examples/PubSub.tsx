import React from 'react';
import { WebSocketLink } from 'apollo-link-ws';

const wsLink = new WebSocketLink({
  uri: `ws://0.0.0.0:3000/graphql`,
  options: {
    reconnect: true
  }
});

const PubSub: React.FC = () => {
  console.log(wsLink);
  return (
    <div>
      PubSub example here
    </div>
  );
}

export default PubSub;
