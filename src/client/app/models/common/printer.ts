/**
 * 接続の種類
 */
export enum connectionType {
    /**
     * なし
     */
    'None' = 'None',
    /**
     * 画像
     */
    'Image' = 'Image',
    /**
     * スター精密 LAN接続
     */
    'StarLAN' = 'StarLAN',
    /**
     * スター精密 Bluetooth接続
     */
    'StarBluetooth' = 'StarBluetooth',
}

/**
 * プリンター一覧
 */
export const printers = [
    {
        connectionType: connectionType.Image,
        name: 'setting.printType.image'
    },
    {
        connectionType: connectionType.StarLAN,
        name: 'setting.printType.starLAN'
    },
    {
        connectionType: connectionType.StarBluetooth,
        name: 'setting.printType.starBluetooth'
    }
];

export interface IPrinter {
    connectionType: connectionType;
    ipAddress: string;
}
