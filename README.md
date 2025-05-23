# SimpleClock

突然時計を作ってみたくなったので作ってみました

## ビルド方法(Mac)

### 前準備

    brew install n
    n install lts
    git clone https://github.com/buchio/simple_clock.git
    cd simple_clock


### ビルド

    npm ci
    npx gulp

### package-lock.json を更新する

    rm package-lock.json
    npm install
    npx gulp

## 機能
- アナログ時計
- デジタル時計

## 実行方法
ビルド後、`dist/index.html` ファイルをウェブブラウザで開いて時計を表示します。

## ライセンス
このプロジェクトはISCライセンスの下でライセンスされています。
