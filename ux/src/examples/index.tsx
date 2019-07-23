import React from 'react';
import Prisma from './Prisma';
import PubSub from './PubSub';

export const SCENARIO_MAP = {
  prisma: `Prisma`,
  pubsub: `Pub Sub`,
};

interface Props {
  scenario: string;
}

const Examples: React.FC<Props> = ({scenario}) => {
  switch (scenario) {
    case SCENARIO_MAP.prisma:
      return <Prisma />;
    case SCENARIO_MAP.pubsub:
      return <PubSub />;
    default:
      return null;
  }
}

export default Examples;
