/**
 * main
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import * as momentTimezone from 'moment-timezone';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';
import * as Functions from './app/functions';
import { getEnvironment } from './environments/environment';

async function main() {
    // タイムゾーン設定
    momentTimezone.tz.setDefault('Asia/Tokyo');
    momentTimezone.locale('ja');

    // 言語設定
    defineLocale('ja', jaLocale);

    // パラメータ設定
    const params = Functions.Util.getParameter();
    if (location.hash === '') {
        sessionStorage.setItem('EXTERNAL', JSON.stringify({ ...params, project: undefined }));
    }

    // プロジェクト設定
    if (params.projectId !== undefined) {
        sessionStorage.removeItem('PROJECT');
    }
    const projectId = (params.projectId === undefined)
        ? (Functions.Util.getProject().projectId === '') ? undefined : Functions.Util.getProject().projectId
        : params.projectId;
    const projectName = (params.projectName === undefined)
        ? (Functions.Util.getProject().projectName === '') ? undefined : Functions.Util.getProject().projectName
        : params.projectName;
    await setProject({ projectId, projectName });
    if (Functions.Util.getProject().storageUrl === undefined) {
        return;
    }
    await setProjectConfig(Functions.Util.getProject().storageUrl);
}

/**
 * プロジェクト情報設定
 */
async function setProject(params: { projectId?: string; projectName?: string; }) {
    const fetchResult = await fetch('/api/project', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    });
    if (!fetchResult.ok) {
        throw new Error(JSON.stringify({ status: fetchResult.status, statusText: fetchResult.statusText }));
    }
    const result: {
        storageUrl: string;
        gmoTokenUrl: string;
        env: string;
    } = await fetchResult.json();
    sessionStorage.setItem('PROJECT', JSON.stringify({
        projectId: (params === undefined)
            ? '' : params.projectId,
        projectName: (params === undefined || params.projectName === undefined)
            ? '' : params.projectName,
        storageUrl: (params === undefined)
            ? ''
            : (params.projectName === undefined)
                ? `${result.storageUrl}/${params.projectId}`
                : `${result.storageUrl}/${params.projectId}-${params.projectName}`
    }));
    const script = document.createElement('script');
    script.src = result.gmoTokenUrl;
    document.body.appendChild(script);
    document.body.classList.add(result.env);
}

/**
 * プロジェクトごとのアプリケーション設定
 */
async function setProjectConfig(storageUrl: string) {
    const now = momentTimezone().toISOString();
    // 設定読み込み
    const fetchResult = await fetch(`${storageUrl}/js/environment.js?=date${now}`, {
        method: 'GET',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
    if (fetchResult.ok) {
        (<any>window).eval(await fetchResult.text());
    }
    const environment = getEnvironment();
    // スタイル設定
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = (await Functions.Util.isFile(`${storageUrl}/css/style.css?=date${now}`))
        ? `${storageUrl}/css/style.css?=date${now}` : `/default/css/style.css?=date${now}`;

    document.head.appendChild(style);
    // ファビコン設定
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon"';
    favicon.href = (await Functions.Util.isFile(`${storageUrl}/favicon.ico`)) ? `${storageUrl}/favicon.ico` : '/default/favicon.ico';
    document.head.appendChild(favicon);
    // タイトル設定
    document.title = environment.APP_TITLE;
    // GTM設定
    if (environment.GTM_ID) {
        (function (w, d, s, l, i) {
            (<any>w)[l] = (<any>w)[l] || [];
            (<any>w)[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            const f = d.getElementsByTagName(s)[0];
            const j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
            (<any>j).async = true;
            (<any>j).src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            (<any>f).parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', environment.GTM_ID);
    }
    if (environment.production) {
        enableProdMode();
    }
}


main().then(async () => {
    const { AppModule } = await import('./app/app.module');
    platformBrowserDynamic().bootstrapModule(AppModule);
}).catch((error) => {
    console.error(error);
});

