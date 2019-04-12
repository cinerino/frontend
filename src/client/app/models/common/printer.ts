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
        connectionType: connectionType.None,
        name: { ja: '印刷しない', en: 'Do not print' }
    },
    {
        connectionType: connectionType.Image,
        name: { ja: '画像表示', en: 'Image display' }
    },
    {
        connectionType: connectionType.StarLAN,
        name: { ja: 'スター精密 LAN接続', en: 'Star precision LAN connection' }
    },
    {
        connectionType: connectionType.StarBluetooth,
        name: { ja: 'スター精密 Bluetooth接続', en: 'Star precision Bluetooth connection' }
    }
];

export interface IPrinter {
    connectionType: connectionType;
    ipAddress: string;
}
