import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-item-profile',
    templateUrl: './item-profile.component.html',
    styleUrls: ['./item-profile.component.scss'],
})
export class ItemProfileComponent implements OnInit {
    @Input() public profile: factory.person.IProfile;
    public environment = getEnvironment();
    public moment = moment;
    public profileList: {
        key: string;
        name: string;
        value?: string;
        label?: { ja: string; en: string };
        valueLabel?: { ja: string; en: string };
    }[];

    constructor() {}

    public ngOnInit() {
        this.profileList = this.getProfile();
    }

    /**
     * 購入者情報取得
     */
    public getProfile() {
        const profile = this.profile;
        const result: {
            key: string;
            name: string;
            value?: string;
            label?: { ja: string; en: string };
            valueLabel?: { ja: string; en: string };
        }[] = [];
        if (profile === undefined) {
            return result;
        }
        this.environment.PROFILE.forEach((p) => {
            const key = p.key;
            if (
                key === 'familyName' ||
                key === 'givenName' ||
                key === 'email' ||
                key === 'telephone' ||
                key === 'address' ||
                key === 'age' ||
                key === 'gender'
            ) {
                result.push({
                    key,
                    name: `form.label.${key}`,
                    value: profile[key],
                    label: p.label,
                    valueLabel:
                        p.option === undefined
                            ? undefined
                            : p.option.find((o) => o.value === profile[key])
                                  ?.label,
                });
                return;
            }
            const value = profile.additionalProperty?.find(
                (a) => a.name === key.replace('additionalProperty.', '')
            )?.value;

            result.push({
                key,
                name: key,
                value,
                label: p.label,
                valueLabel:
                    p.option === undefined
                        ? undefined
                        : p.option.find((o) => o.value === value)?.label,
            });
        });
        if (profile.additionalProperty !== undefined) {
            const extraAdditionalProperty = profile.additionalProperty.filter(
                (a) => {
                    const findResult = result.find(
                        (r) =>
                            r.key.replace('additionalProperty.', '') === a.name
                    );
                    return findResult === undefined;
                }
            );
            extraAdditionalProperty.forEach((a) => {
                result.push({
                    key: a.name,
                    name: '',
                    value: a.value,
                    label: { ja: a.name, en: a.name },
                });
            });
        }
        return result.filter((r) => r.value !== undefined);
    }
}
