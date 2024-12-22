#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HealthDataApiStack } from '../lib/health-data-api-stack.ts';
import { RDSStack } from '../lib/RDS-stack';

const app = new cdk.App();
new HealthDataApiStack(app, 'CdkStack', {
    env:{
        account: '992382371662',
        region: 'us-east-1',
    }
});

// new RDSStack(app, 'DiffStack', {
//     env:{
//         account: '992382371662',
//         region: 'us-east-1',
//     }
// });