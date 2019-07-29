/**
 * mail
 */
import { factory } from '@cinerino/api-nodejs-client';
import * as debug from 'debug';
import * as ejs from 'ejs';
import { Request, Response } from 'express';
import * as libphonenumber from 'libphonenumber-js';
import * as momentTimezone from 'moment-timezone';
import * as request from 'request';
import { errorProsess } from '../base/base.controller';
const log = debug('frontend:mail');

export async function getTemplate(req: Request, res: Response) {
    log('getTemplate');
    try {
        const view = await requestAsync(`${<string>process.env.STORAGE_URL}${req.body.view}`);
        momentTimezone.tz('Asia/Tokyo');
        const template = await ejs.render(view, {...req.body, moment: momentTimezone, formatTelephone, getTicketPrice }, { async: true });
        res.json({ template });
    } catch (err) {
        errorProsess(res, err);
    }
}

export async function getReturnTemplate(req: Request, res: Response) {
    log('getReturnTemplate');
    try {
        const view = await requestAsync(`${<string>process.env.STORAGE_URL}/ejs/mail/return.ejs`);
        momentTimezone.tz('Asia/Tokyo');
        const template = await ejs.render(view, {...req.body, moment: momentTimezone, formatTelephone, getTicketPrice }, { async: true });
        res.json({ template });
    } catch (err) {
        errorProsess(res, err);
    }
}

async function requestAsync(url: string, options?: any) {
    return new Promise<string>((resolve, reject) => {
        request.get(url, options, (error, _response, body) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(body);
        });
    });
}

/**
 * 電話番号変換
 */
export function formatTelephone(telephone: string, format?: libphonenumber.NumberFormat) {
    if (telephone === undefined) {
        return '';
    }
    const parseNumber = libphonenumber.parse(telephone, 'JP');
    format = (format === undefined) ? 'International' : format;

    return libphonenumber.format(parseNumber, format).replace(/\s/g, '');
}

/**
 * 券種金額取得
 */
export function getTicketPrice(
    ticket: factory.chevre.event.screeningEvent.ITicketOffer
        | factory.order.IAcceptedOffer<factory.order.IItemOffered>
        | factory.action.authorize.offer.seatReservation.IAcceptedOffer4chevre
) {
    const result = {
        unitPriceSpecification: 0,
        videoFormatCharge: 0,
        soundFormatCharge: 0,
        movieTicketTypeCharge: 0,
        total: 0,
        single: 0
    };
    if (ticket.priceSpecification === undefined) {
        return result;
    }
    const priceComponent = (<factory.chevre.event.screeningEvent.ITicketPriceSpecification>ticket.priceSpecification).priceComponent;
    const priceSpecificationType = factory.chevre.priceSpecificationType;
    const unitPriceSpecifications = priceComponent.filter((s) => s.typeOf === priceSpecificationType.UnitPriceSpecification);
    const videoFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.VideoFormatChargeSpecification);
    const soundFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.SoundFormatChargeSpecification);
    const movieTicketTypeCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.MovieTicketTypeChargeSpecification);

    result.unitPriceSpecification += unitPriceSpecifications[0].price;
    videoFormatCharges.forEach((videoFormatCharge) => {
        result.videoFormatCharge += videoFormatCharge.price;
    });
    soundFormatCharges.forEach((soundFormatCharge) => {
        result.soundFormatCharge += soundFormatCharge.price;
    });
    movieTicketTypeCharges.forEach((movieTicketTypeCharge) => {
        result.movieTicketTypeCharge += movieTicketTypeCharge.price;
    });
    result.total = result.unitPriceSpecification + result.videoFormatCharge + result.soundFormatCharge + result.movieTicketTypeCharge;
    const unitPriceSpecification = unitPriceSpecifications[0];
    if (unitPriceSpecification.typeOf === priceSpecificationType.UnitPriceSpecification) {
        const referenceQuantityValue = (unitPriceSpecification.referenceQuantity.value === undefined)
            ? 1
            : unitPriceSpecification.referenceQuantity.value;
        result.single = result.total / referenceQuantityValue;
    }

    return result;
}
