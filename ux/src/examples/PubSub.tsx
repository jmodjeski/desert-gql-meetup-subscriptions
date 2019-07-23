import React, {useEffect, useState} from 'react';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import {request} from 'graphql-request';
import {Message} from '../types';

const GRAPHQL_ENDPOINT = `http://0.0.0.0:3000/graphql`;

// must be 4000, 3000 produces a 400 error during handshake
const SUBSCRIPTION_ENDPOINT = `ws://0.0.0.0:4000/graphql`;

const client = new SubscriptionClient(
  SUBSCRIPTION_ENDPOINT,
  {
    reconnect: true,
  },
);

const PubSub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // subscribe/unsubscribe to channel
  useEffect(() => {
    const subscription = client.request({
      query: `subscription($channel: String!) {
        pubsub(channel: $channel) {
          content
        }
      }`,
      variables: {
        channel: `pubsub`,
      },
    }).subscribe({
      next: ({data}) => {
        const message = data.pubsub;
        // for reverse order - [message].concat(msgs)
        setMessages((msgs => msgs.concat(message)));
      }
    });

    return function cleanup() {
      return subscription.unsubscribe();
    }
  });


  const handleStart = () => request(GRAPHQL_ENDPOINT, `
    mutation {
      createChannel(channel: "pubsub", intervalMs: 1000)
    }
  `);

  const handleStop = () => request(GRAPHQL_ENDPOINT, `
    mutation {
      destroyChannel(channel: "pubsub")
    }
  `);

  const messageEls = messages.map((msg) => (<ListGroupItem>{msg.content}</ListGroupItem>));

  return (
    <React.Fragment>
      <Button color="primary" onClick={handleStart}>Start Channel</Button>
      <Button color="danger" onClick={handleStop}>Stop Channel</Button>
      <div>
        Messages (Count: {messages.length}):
      </div>
      <ListGroup className="list">
        {messageEls}
      </ListGroup>
    </React.Fragment>
  );
}

export default PubSub;
