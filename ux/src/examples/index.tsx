import React from 'react';
import Example from './Example';
import {MaybeScenario} from '../types';

const Examples: React.FC<{scenario: MaybeScenario}> = ({scenario}) => {
  if (!scenario) {
    return null;
  }
  return <Example scenario={scenario} />;
}

export default Examples;
