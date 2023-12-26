import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../types/app.types';
import WebInterfaceConstruct from '../constructs/web.construct';

export default class MainStack extends cdk.Stack {
  private stackPrefix: string;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    this.stackPrefix = `${props.appName}-${props.stageModifier}`;
    new WebInterfaceConstruct(this, `${this.stackPrefix}-web-interface`, props);
  }
}
