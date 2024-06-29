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

