import {Scenario} from './types';

export const CHANNELS = {
  prisma: `PRISMA`,
  pubsub: `PUBSUB`,
  pubsubFast: `PUBSUB_FAST`,
  pubsubBuffered: `PUBSUB_BUFFERED`,
};

export const SCENARIOS: Scenario[] = [
  {
    channel: CHANNELS.prisma,
    label: 'Prisma',
    intervalMs: 1000,
    subscriptionName: `prisma`,
    subscriptionQuery: `
      subscription {
        prisma {
          content
        }
      }
    `
  },
  {
    channel: CHANNELS.pubsub,
    label: 'Pub Sub (1 Second Messages)',
    intervalMs: 1000,
    subscriptionName: `pubsub`,
    subscriptionQuery: `
      subscription($channel: String!) {
        pubsub(channel: $channel) {
          content
        }
      }
    `,
    subscriptionVariables: {
      channel: CHANNELS.pubsub,
    }
  },
  {
    channel: CHANNELS.pubsubFast,
    label: 'Pub Sub Fast (1 Millisecond Messages/No Throttle)',
    intervalMs: 1,
    subscriptionName: `pubsub`,
    subscriptionQuery: `
      subscription($channel: String!) {
        pubsub(channel: $channel) {
          content
        }
      }
    `,
    subscriptionVariables: {
      channel: CHANNELS.pubsubFast,
    }
  },
  {
    channel: CHANNELS.pubsubBuffered,
    label: 'Pub Sub Buffered (1 Millisecond Messages With Throttle)',
    intervalMs: 1,
    subscriptionName: `pubsubBuffered`,
    subscriptionQuery: `
      subscription($channel: String!) {
        pubsub(channel: $channel) {
          content
        }
      }
    `,
    subscriptionVariables: {
      channel: CHANNELS.pubsubBuffered,
    }
  },
];
