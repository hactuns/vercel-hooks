import { config, createLogger, format, transports } from 'winston';
import CloudwatchTransport from 'cloudwatch-transport';

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
    new CloudwatchTransport({
      logGroupName: String(process.env.AWS_LOG_GROUP),
      logStreamName: [
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear(),
      ].join('/'),
      awsCredentials: {
        accessKeyId: String(process.env.AWS_KEY),
        secretAccessKey: String(process.env.AWS_SECRET),
        region: String(process.env.AWS_REGION),
      },
      enabled: String(process.env.NODE_ENV) !== 'dev',
    }),
  ],
});

export default Logger;
