# KintoneとHAWK-Apiの連携

[Kintone](https://kintone.cybozu.co.jp/index.html)から、[HAWK-Api](https://api-hawk.rox-jp.com/v1.0/docs)に連携させて予測を行います。
過去のデータ（実績データ）をもとに、予測日から45日分の予測結果を返します。


## Features
[kintone.proxy](https://cybozu.dev/ja/kintone/docs/js-api/proxy/kintone-proxy/)を使用して、外部のAPI(HAWK-Api)を実行しています。


## Prerequisites
#### HAWK-Apiを使用するためのプライベートキーやURLが必要です。


## Usage

1. 予測に使用する実績データと、設定情報を準備します
```js
let actual = [
  {
    date: '20210101',
    value: 100
  },
  {
    date: '20210102',
    value: 150
  },
  // 必要に応じて実績データを追加
];

let settings = {
  requestForecastUrl: 'forecast_url',
  requestGetJobStatusUrl: 'job_statsu_url',
  privateKey: 'your_private_key',
};
```

2. runForecastSteps関数を呼び出して予測結果を取得します
```js
let forecastResults = await runForecastSteps(actual, settings);
console.log(forecastResults);
```

* レスポンスの例
```js
[
  [
    loc_zip_code: "loc_zip_code"
    pred: [
      {
        date: "2021-03-01"
        value: 50
      },
      {
        date: "2024-03-02"
        value: 130
      },
    ]
    spot_id: "pred_ID"
  ]
]
```

## Example

### 関数の使用例を以下に示します：
```js
// 呼び出し例

let actual = [
  {
    date: '20210101',
    value: 100
  },
  {
    date: '20210102',
    value: 150
  },
  // 必要に応じてデータポイントを追加
];

let settings = {
  requestForecastUrl: 'forecast_url',
  requestGetJobStatusUrl: 'job_statsu_url',
  privateKey: 'your_private_key',
};

await runForecastSteps(actual, settings)
  .then(forecastResults => {
    console.log(forecastResults);
  })
  .catch(error => {
    console.error('予測取得エラー:', error);
  });

```


## Function Reference
* `runForecastSteps(actual, settings)`: <br>
この関数は予測ステップを実行し、予測結果を返します

### Parameters
* `actual` (Array of Objects)       : 過去のデータ（実績データ）を含む配列

  `date` (String)                   : データポイントの日付（フォーマット：YYYYMMDD）<br>
  `value` (Number)                  : データポイントの値（例：売上高、受注金額 etc...）


* `settings` (Object)               : HAWK-Apiリクエストの設定

  `requestForecastUrl` (String)     : 予測データをリクエストするURL <br>
  `requestGetJobStatusUrl` (String) : ジョブステータスを確認するURL <br>
  `privateKey` (String)             : HAWK-Apiに認証するためのプライベートキー 

### Returns
* 予測日から45日分の予測結果


# Author

* Author <br>
So Tatsumi
* Organization <br>
[株式会社ゼンク](https://zenk.co.jp/)


# License
[MIT license](https://choosealicense.com/licenses/mit/).
