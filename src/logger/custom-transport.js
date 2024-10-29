import TransportStream from 'winston-transport';
import { Logger, createLogStream } from 'aws-cloudwatch-log';

class CustomTransport extends TransportStream {
  constructor(opts) {
    super(opts);

    createLogStream(opts.logStreamName, opts).catch(() => null);
    this._client = new Logger({
      logGroupName: null,
      logStreamName: null,
      region: null,
      accessKeyId: null,
      secretAccessKey: null,
      uploadFreq: 500,
      local: false,
      ...opts,
    });

    this._enabled = opts.enabled;
  }

  log(info, callback) {
    if (this._enabled) {
      const level = info.level;
      const message = info.message;

      const meta = Object.assign({}, info);
      delete meta.level;
      delete meta.message;
      const logMsg = `[${String(level).toUpperCase()}]: ${message} - ${JSON.stringify(meta)}`;

      this._client.log(logMsg);
    }

    // Avoid serverless shutdown
    setTimeout(() => {
      callback();
    }, 2_500);
  }
}

export default CustomTransport;
