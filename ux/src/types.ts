export interface Message {
  content: string;
}
export interface Scenario {
  channel: string;
  label: string;
  intervalMs: number;
  subscriptionName: string;
  subscriptionQuery: string;
  subscriptionVariables?: {[prop: string]: any};
}

type Maybe<T> = T | null;
export type MaybeScenario = Maybe<Scenario>;
