/**
     * 接続の種類
     */
export enum ConnectionType {
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
        connectionType: ConnectionType.Image,
        name: 'setting.printType.image'
    },
    {
        connectionType: ConnectionType.StarLAN,
        name: 'setting.printType.starLAN'
    },
    {
        connectionType: ConnectionType.StarBluetooth,
        name: 'setting.printType.starBluetooth'
    }
];

export interface IPrinter {
    connectionType: ConnectionType;
    ipAddress: string;
}
