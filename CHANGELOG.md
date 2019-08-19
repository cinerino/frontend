# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## Unreleased
### Added

### Changed

### Fixed

### Security

## 2.1.0 - 2019-08-19
### Added
- 発券期限の設定追加
- 劇場名、スクリーン名へcssクラス追加
### Changed
- メールテンプレートをejsへ変更
- 取引期限をサーバータイムから算出へ変更

## 2.0.0 - 2019-07-22
### Chenged
- actionをserviceから利用へ変更

## 1.2.2 - 2019-07-04
### Fixed
- 同一注文での別日付予約不具合修正

## 1.2.1 - 2019-06-28
### Added
- webpack-bundle-analyzer追加
### Changed
- gzip対応
- カスタムQR文字列拡張
### Fixed
- 印刷処理修正

## 1.2.0 - 2019-06-27
### Added
- 売止時間制御追加
### Changed
- 仮予約残数表示へ変更

## 1.1.3 - 2019-06-22
### Fixed
- 印刷処理修正

## 1.1.2 - 2019-06-22
### Fixed
- 依存関係不具合修正

## 1.1.1 - 2019-06-21
### Fixed
- 印刷処理修正

## 1.1.0 - 2019-06-18
### Added
- 外部連携にpassportTokenを追加
- 照会ページへキーパッド設定追加
- 照会ページに印刷完了ページ追加
- 購入完了画面に「決済方法」と「決済金額」の項目追加
### Changed
- 返品完了メールカスタマイズ可能へ変更
- angular8へ変更
- プリンターIPを動的に挿入するよう変更
### Fixed
- フラッパー連携QRコード修正
- 返品済みの注文を照会した際の不具合修正
- タッチイベントの動作改善
- 枚数表記修正

## 1.0.0 - 2019-06-06
### Added
- リリース