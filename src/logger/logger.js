process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

import { config, createLogger, format, transports } from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

const currentDate = new Date();
const Logger = createLogger({
  levels: config.syslog.levels,
  level: 'debug',
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.combine(
        format.metadata(),
        format.printf((info) => {
          return `[${new Date().toISOString()}] [${info.level.toUpperCase()}]: ${info.message} - ${JSON.stringify(info.metadata ?? {})}`;
        }),
        format.colorize({ all: true })
      ),
    }),
    ...(String(process.env.NODE_ENV) !== 'dev'
      ? [
          new CloudWatchTransport({
            logGroupName: String(process.env.AWS_LOG_GROUP),
            logStreamName: currentDate.getMonth() + '/' + currentDate.getFullYear(),
            createLogGroup: true,
            createLogStream: true,
            submissionInterval: 2000,
            submissionRetryCount: 1,
            batchSize: 20,
            awsConfig: {
              accessKeyId: String(process.env.AWS_KEY),
              secretAccessKey: String(process.env.AWS_SECRET),
              region: String(process.env.AWS_REGION),
            },
            formatLog: (item) =>
              `[${String(item.level).toUpperCase()}]: ${item.message} - ${JSON.stringify(item.meta ?? item.metadata ?? {})}`,
          }),
        ]
      : []),
  ],
});

export default Logger;
