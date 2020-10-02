import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as helmet from 'helmet';
import basicAuth from './middlewares/basicAuth/basic-auth.middleware';
import benchmarks from './middlewares/benchmarks/benchmarks.middleware';
import ipFilter from './middlewares/ipFilter/ip-filter.middleware';
import session from './middlewares/session/session.middleware';
import router from './routes/router';

process.env.VERSION = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

/**
 * express設定
 */
const app = express();

app.use(ipFilter); // IP制限
app.use(basicAuth); // ベーシック認証
app.use(helmet()); // セキュリティー対策
app.set('trust proxy', 1);
app.use(session); // セッション
app.use(benchmarks); // ベンチマーク的な
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', `${__dirname}/../../../views`); // view設定
app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static(`${__dirname}/../../../public`)); // server
app.use(express.static(`${__dirname}/../../client`, { index: false })); // client
router(app);

export = app;
