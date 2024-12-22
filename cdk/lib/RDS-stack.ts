import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput } from 'aws-cdk-lib';

export class RDSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC for the RDS instance
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    }
    );

    // Create the RDS MySQL database instance
    const mySqlDatabase = new rds.DatabaseInstance(this, 'MySqlDatabase', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      credentials: rds.Credentials.fromUsername('admin', {
        password: cdk.SecretValue.unsafePlainText('Os.s3$$-ctn69bRxefQtn_Z$V7eM'),  // Use Secrets Manager for sensitive information in production
      }),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      publiclyAccessible: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function to query MySQL RDS
    const healthDataLambda = new lambda.Function(this, 'HealthDataLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'queryDatabase.handler', // Make sure your lambda file is named `queryDatabase.js` and has an exported `handler` function
      code: lambda.Code.fromAsset('lambda'), // Point to the `lambda` folder containing `queryDatabase.js`
      environment: {
        DB_HOST: mySqlDatabase.dbInstanceEndpointAddress,
        DB_USER: 'admin',
        DB_PASSWORD: 'Os.s3$$-ctn69bRxefQtn_Z$V7eM',
        DB_NAME: 'cs6440_team82',  // Replace with your database name in RDS
      },
      allowPublicSubnet: true,
      vpc,
    });

    // Allow Lambda to connect to the RDS instance in the VPC
    mySqlDatabase.connections.allowFrom(healthDataLambda, ec2.Port.tcp(3306));

    // Create an API Gateway to access the Lambda function
    const api = new apigateway.RestApi(this, 'HealthDataApi', {
      restApiName: 'Health Data Service',
      description: 'An API to get health data from MySQL RDS.',
      endpointConfiguration: {
        types: [apigateway.EndpointType.REGIONAL],
      },
    });

    // Create a resource and method for health data
    const healthDataResource = api.root.addResource('healthdata');
    const healthDataIntegration = new apigateway.LambdaIntegration(healthDataLambda);
    healthDataResource.addMethod('GET', healthDataIntegration); // GET /healthdata

    // Output the API endpoint URL
    new CfnOutput(this, 'HealthDataApiUrl', {
      value: api.url,
      description: 'The URL of the Health Data API',
    });
  }
}
