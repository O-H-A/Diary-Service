import { Eureka } from 'eureka-js-client';
import { EUREKA_HEARTBEAT_INTERVAL, EUREKA_REGISTERY_INTERVAL } from '../common/utils/constant';

const env = process.env.NODE_ENV;

const appName = `DIARY-SERVICE${env === 'dev' ? '-DEV' : ''}`;
const executeUrl = `${process.env.HOST}:${process.env.PORT}`;

export const EurekaClient = new Eureka({
  instance: {
    app: appName,
    hostName: process.env.HOST,
    ipAddr: process.env.HOST,
    port: {
      $: process.env.PORT,
      '@enabled': true,
    },
    vipAddress: appName,
    statusPageUrl: `http://${executeUrl}/info`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: process.env.Eureka_HOST,
    port: process.env.Eureka_PORT,
    servicePath: '/eureka/apps/',
    heartbeatInterval: EUREKA_HEARTBEAT_INTERVAL,
    registryFetchInterval: EUREKA_REGISTERY_INTERVAL,
  },
});
