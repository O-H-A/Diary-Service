import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as moment from 'moment-timezone';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYYMMDD',
    dirname: `logs/${level}`,
    filename: `%DATE%_${level}.log`,
    maxFiles: 2, // 2일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`),
    ),
  };
};

export const WINSTON_CONFIG = {
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => moment().tz('Asia/Seoul').format('MM-DD HH:mm:ss'),
        }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
    new winstonDaily(dailyOptions('error')),
  ],
};

// export const WinstonLogger = WinstonModule.createLogger({
//   transports: [
//     new winston.transports.Console({
//       level: env === 'prod' ? 'http' : 'silly', //production 환경이라면 http, 개발환경이라면 모든 단계를 로그
//       // level: 'sily',
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
//         }),
//         winston.format.colorize(),
//         utilities.format.nestLike('DIARY', { prettyPrint: true }),
//       ),
//     }),
//   ],
// });
