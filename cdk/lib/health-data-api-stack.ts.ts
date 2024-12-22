import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';

import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as ecspatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as logs from 'aws-cdk-lib/aws-logs';
import path = require('path');
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { Cors } from 'aws-cdk-lib/aws-apigateway';

export class HealthDataApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, 'HealthApiCluster', {
      clusterName: 'health-api-model-endpoint',
      vpc: ec2.Vpc.fromLookup(this, 'HealthApiVPC',{
        vpcId: 'vpc-06cf7f2ec7546fbcd',
      })
    })

    const publicSubnets = cluster.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    });
    
    const image = ContainerImage.fromAsset('container')

    new ecspatterns.ApplicationLoadBalancedFargateService(this, 'amazon-ecs-sample', {
      cluster,
      // circuitBreaker: {
      //   rollback: true,
      // },
      memoryLimitMiB: 512, // Supported configurations: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsFargateService.html#memorylimitmib
      cpu: 256,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
      },
      assignPublicIp: true,
      taskSubnets: publicSubnets,
      desiredCount: 1,

      // healthCheck: {
      //   command: [ "CMD-SHELL", "curl -f http://localhost/ || exit 1" ],
      //   // the properties below are optional
      //   // interval: Duration.minutes(1),
      //   retries: 2,
      //   // startPeriod: Duration.minutes(1),
      //   timeout: Duration.seconds(10),
      // },
      taskImageOptions: {
        image: image,
        containerPort: 80,
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: id,
          logRetention: logs.RetentionDays.ONE_YEAR,
        }),
      },
    });
  

    const healthDataTable = new dynamodb.Table(this, 'HealthDataTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY
    });

    const healthDataLambda = new lambda.Function(this, 'HealthDataLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        HEALTH_DATA_TABLE_NAME: healthDataTable.tableName,
      },
    });

    healthDataTable.grantReadWriteData(healthDataLambda);

    
    const api = new apigateway.RestApi(this, 'HealthDataApi', {
      restApiName: 'Health Data Service',
      description: 'An API to get and set health data for users.',
      endpointConfiguration: {
        types: [apigateway.EndpointType.REGIONAL],
      },
      // defaultCorsPreflightOptions: {
      //   allowMethods: ['GET', 'POST'],
      //   allowOrigins: ['http://localhost:3000'],
      // },
    });

    const healthDataResource = api.root.addResource('healthdata');

    const healthDataOptions = {
      allowOrigins: ['http://localhost:3000'],
      allowMethods: [ 'GET', 'POST'], // Include OPTIONS for CORS preflight
      allowHeaders: ['Content-Type', 'Authorization'], // Add any headers your API requires
    };

    

    const healthDataIntegration = new apigateway.LambdaIntegration(healthDataLambda);

    healthDataResource.addMethod('GET', healthDataIntegration,{
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    });

    healthDataResource.addMethod('POST', healthDataIntegration,{
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }],
      
    });
    
    // healthDataResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    //   integrationResponses: [{
    //     statusCode: "200",
    //     responseParameters: {
    //       'method.response.header.Access-Control-Allow-Headers': `'${healthDataOptions.allowHeaders.join(",")}'`,
    //       'method.response.header.Access-Control-Allow-Methods': `'${healthDataOptions.allowMethods.join(",")}'`,
    //       'method.response.header.Access-Control-Allow-Origin': `'${healthDataOptions.allowOrigins[0]}'`,
    //     },
    //   }],
    //   requestTemplates: {
    //     'application/json': '{"statusCode": 200}',
    //   },
    // }), {
    //   methodResponses: [{
    //     statusCode: "200",
    //     responseParameters: {
    //       'method.response.header.Access-Control-Allow-Headers': true,
    //       'method.response.header.Access-Control-Allow-Methods': true,
    //       'method.response.header.Access-Control-Allow-Origin': true,
    //     },
    //   }],
    // });

    addCorsOptions(healthDataResource)

    new CfnOutput(this, 'HealthDataApiTable', {
      value: healthDataTable.tableName,
    })

  }
  
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    // In case you want to use binary media types, uncomment the following line
    // contentHandling: ContentHandling.CONVERT_TO_TEXT,
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    // In case you want to use binary media types, comment out the following line
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}
