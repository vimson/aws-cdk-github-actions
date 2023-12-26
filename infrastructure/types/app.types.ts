import { AppProps } from 'aws-cdk-lib';

export interface ApplicationProps extends AppProps {
  appName: string;
  stage: string;
  dbHost: string;
  stageModifier: string;
}
