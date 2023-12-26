#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import MainStack from './stacks/main.stack';

const app = new cdk.App();

const appName = app.node.tryGetContext('appName') ?? 'cdk-github-actions-stack';
const stage = app.node.tryGetContext('stage') ?? 'dev';
const stageContext = app.node.tryGetContext(stage);

new MainStack(app, `${appName}-${stageContext?.stageModifier}`, {
  env: { region: 'eu-west-1' },
  ...stageContext,
  appName,
});
