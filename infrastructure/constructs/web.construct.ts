import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ApplicationProps } from '../types/app.types';

export default class WebInterfaceConstruct extends Construct {
  private constructName: string;

  private apiGateway: apigateway.RestApi;

  private getServiceStatusLambda: lambda.NodejsFunction;

  constructor(
    scope: Construct,
    constructName: string,
    props: ApplicationProps,
  ) {
    super(scope, constructName);
    this.constructName = constructName;

    this.initialiseApiGateway();
    this.initialiseLambdas(props);
    this.assignRoutes();
  }

  initialiseApiGateway() {
    this.apiGateway = new apigateway.RestApi(this, 'HttpServiceApiGateway', {
      restApiName: `${this.constructName}-api-gateway`,
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });
  }

  initialiseLambdas(props: ApplicationProps) {
    this.getServiceStatusLambda = new lambda.NodejsFunction(
      this,
      'GetServiceStatusLambda',
      {
        entry: path.resolve(__dirname, '../../src/handlers/http/get-status.ts'),
        functionName: `${this.constructName}-get-status`,
        handler: 'handler',
        memorySize: 512,
        environment: {
          DB_HOST: props.dbHost,
        },
        runtime: Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(15),
        bundling: {
          target: 'es2020',
          keepNames: true,
          logLevel: lambda.LogLevel.INFO,
          sourceMap: true,
          minify: true,
        },
      },
    );
  }

  assignRoutes() {
    const serviceStatusLambdaIntegration = new apigateway.LambdaIntegration(
      this.getServiceStatusLambda,
    );

    const httpServiceResource = this.apiGateway.root;
    httpServiceResource.addMethod('GET', serviceStatusLambdaIntegration);
  }
}
