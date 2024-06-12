
/** 
actual = [
  {
    'date'  : String,
              title: 日時
              example: 20210101
    'value' : Number
              title: 値（売り上げなど）
  },
  {
    'date' : String,
    'value' : Number
  },
]

settings = {
  'requestForecastUrl': '',
  'requestGetJobStatusUrl': '',
  'privateKey': '',
}
*/

/**
 * @param {Object} actual
 * @param {string} date - 日時 (例: 20210101)
 * @param {number} value - 値 (売り上げなど)
 * 
 * @param {Object} settings
 * @param {string} requestForecastUrl - 予測リクエストURL
 * @param {string} requestGetJobStatusUrl - ジョブステータス取得リクエストURL
 * @param {string} privateKey - プライベートキー
 * 
 * @return {Object} result 
 */

async function runForecastSteps(actual, settings) {
  console.log('runForecastSteps');

  /// Hawk-Apiリクエストヘッダー
  let requestHeaders = {
    'accept': 'application/json',
    'Authorization': 'Bearer' + ' ' + settings.privateKey,
    'Content-Type': 'application/json',
  };
  let predId = 'pred_ID';
  let locZipCode = 'loc_zip_code';

  /// Hawk-Api予測開始実行

  /// 予測に必要なbodyを作成
  let PredictedData = [
    {
      'spot_id': predId,
      'loc_zip_code': locZipCode,
      'actual': actual
    }
  ];
  console.log(PredictedData);

  /// Hawk-Api予測開始
  let startForecastResponses = [];
  let startForecastResponse = await kintone.proxy(settings.requestForecastUrl + predId, 'POST', requestHeaders, JSON.stringify(PredictedData));
  startForecastResponses.push(JSON.parse(startForecastResponse[0]).job_id);

  /// ジョブステータスの確認へ
  let jobStatusCheck = await checkJobStatus();
  if (!jobStatusCheck) {
    return null;
  }

  /// ジョブステータス確認
  async function checkJobStatus() {
    let jobStatusesArray = [];

    /// Hawk-Api ジョブステータスを確認
    let jobStatusResponse = await kintone.proxy(settings.requestGetJobStatusUrl + startForecastResponses[0], 'GET', requestHeaders, {});
    jobStatusesArray.push(JSON.parse(jobStatusResponse[0]).job_status);

    /// SUCCESS以外の要素が含まれるか確認
    if (jobStatusesArray.some(status => status !== 'SUCCESS')) {
      /// SUCCESS以外の要素が含まれる場合
      console.log('Job is running');
      /// 指定の秒数(25秒)待ち、再帰処理
      await new Promise(resolve => setTimeout(resolve, 25000));
      return checkJobStatus();
    }

    return true;
  }

  /// 予測結果取得
  let forecastResultResponsesArray = [];

  ///　Hawk-Api 予測の結果を取得
  let forecastResultResponse = await kintone.proxy(settings.requestForecastUrl + predId, 'GET', requestHeaders, {});
  forecastResultResponsesArray.push(JSON.parse(forecastResultResponse[0]));

  let judgeExistForecast = forecastResultResponsesArray.map(predictionResult => predictionResult[0].pred.length > 0 ? 'true' : 'false');

  /// すべての予測結果が返されているか確認
  if (judgeExistForecast.some(exist => exist !== 'true')) {
    console.log('予測結果が返されませんでした。処理を終了します。');
    return null;
  }

  return { forecastResultResponsesArray };
};
