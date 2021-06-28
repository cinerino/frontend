import { factory } from '@cinerino/sdk';
import { getProject } from './util.function';

/**
 * クレジットカードトークンオブジェクト作成
 */
export async function createCreditCardTokenObject(params: {
    creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    };
    seller: factory.chevre.seller.ISeller;
}): Promise<ISonyTokenObject | IGmoTokenObject> {
    const { seller, creditCard } = params;
    if (seller.paymentAccepted === undefined) {
        throw new Error('seller.paymentAccepted is undefined');
    }
    const findPaymentAcceptedResult = seller.paymentAccepted.find(
        (paymentAccepted) => {
            return (
                paymentAccepted.paymentMethodType ===
                factory.paymentMethodType.CreditCard
            );
        }
    );
    if (
        findPaymentAcceptedResult === undefined ||
        findPaymentAcceptedResult.paymentMethodType !==
            factory.paymentMethodType.CreditCard
    ) {
        throw new Error('paymentMethodType CreditCard not found');
    }
    const gmoInfo:
        | {
              shopId?: string;
              tokenizationCode?: string;
          }
        | undefined = (<any>findPaymentAcceptedResult).gmoInfo;
    if (gmoInfo === undefined) {
        throw new Error('gmoInfo undefined');
    }
    if (gmoInfo.tokenizationCode !== undefined) {
        return await createSonyTokenObject({
            creditCard,
            tokenizationCode: gmoInfo.tokenizationCode,
        });
    }
    if (gmoInfo.shopId !== undefined) {
        return await createGmoTokenObject({
            creditCard,
            shopId: gmoInfo.shopId,
        });
    }

    throw new Error('gmoInfo.shopId or gmoInfo.tokenizationCode undefined');
}

/**
 * GMOトークンオブジェクト
 */
export interface IGmoTokenObject {
    token: string;
    toBeExpiredAt: string;
    maskedCardNo: string;
    isSecurityCodeSet: boolean;
}

/**
 * GMOトークンオブジェクト生成
 */
function createGmoTokenObject(params: {
    creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    };
    shopId: string;
}) {
    const { creditCard, shopId } = params;
    return new Promise<IGmoTokenObject>((resolve, reject) => {
        (<any>window).someCallbackFunction =
            function someCallbackFunction(response: {
                resultCode: string;
                tokenObject: IGmoTokenObject;
            }) {
                if (response.resultCode === '000') {
                    resolve(response.tokenObject);
                } else {
                    reject(new Error(response.resultCode));
                }
            };
        const Multipayment = (<any>window).Multipayment;
        Multipayment.init(shopId);
        Multipayment.getToken(creditCard, (<any>window).someCallbackFunction);
    });
}

/**
 * Sonyトークンオブジェクト
 */
export interface ISonyTokenObject {
    token: string;
    maskedCardNo: string;
}

/**
 * Sonyトークンオブジェクト生成
 */
function createSonyTokenObject(params: {
    creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    };
    tokenizationCode: string;
}) {
    return new Promise<ISonyTokenObject>((resolve, reject) => {
        const { creditCard, tokenizationCode } = params;
        const tokenUrl = getProject().sonyTokenUrl;
        if (tokenUrl === undefined) {
            reject(new Error('sonyTokenUrl undefined'));
        }
        const script = document.createElement('script');
        script.id = 'sonypayment';
        script.src = `${tokenUrl}?k_TokenNinsyoCode=${tokenizationCode}`;
        script.classList.add('spsvToken');
        script.setAttribute('callBackFunc', 'setToken');
        script.onload = () => {
            if ((<any>window).SpsvApi === undefined) {
                reject(new Error('SpsvApi undefined'));
                return;
            }
            (<any>window).SpsvApi.spsvCreateToken(
                creditCard.cardno,
                creditCard.expire.slice(2, 4),
                creditCard.expire.slice(4, 6),
                creditCard.securityCode,
                '',
                '',
                '',
                '',
                ''
            );
            (<any>window).setToken = function setToken(
                token: string,
                card: string
            ) {
                script.remove();
                (<any>window).SpsvApi = undefined;
                resolve({
                    token,
                    maskedCardNo: card,
                });
            };
        };
        script.onerror = (event) => {
            script.remove();
            (<any>window).SpsvApi = undefined;
            const message =
                typeof event === 'string' ? event : JSON.stringify(event);
            reject(new Error(message));
        };
        document.head.appendChild(script);
    });
}
