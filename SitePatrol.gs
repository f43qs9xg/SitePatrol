var sheet = SpreadsheetApp.openById("spread sheat ID").getSheetByName('spread sheat tabname');
var lastRow = sheet.getLastRow();

// Slack API の設定
var slack_token = "slack token"; // Bot User OAuth Access Token
var slackApp = SlackApp.create(slack_token);
var channelId = "slack channel ID";

// スプレッドシートの列の定義
var SITE_NAME_COL = 1;
var RSS_URL_COL = 2;
var MAIN_URL = 3;
var HASH_COL = 4;

function Main(){
  for(var i = 2; i<= lastRow; i++){
    console.log(sheet.getRange(i, RSS_URL_COL).getValue());
    var targetSiteName = sheet.getRange(i, SITE_NAME_COL).getValue();
    var targetSiteRssUrl = sheet.getRange(i, RSS_URL_COL).getValue();
    var targetUrl = sheet.getRange(i, MAIN_URL).getValue();

    updateCheck(targetSiteName, targetSiteRssUrl,targetUrl, i);
  }

}


/**
 * サイトの更新をチェック
 * targetSiteName : サイト名
 * targetSiteRssUrl: RSSのURL
 * targetUrl:通知したいURL
 * row:行数
 */
function updateCheck(targetSiteName,targetSiteRssUrl,targetUrl ,row) {
  // ページ情報を取得
  var response = UrlFetchApp.fetch(targetSiteRssUrl);
  var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, response.getContentText()).toString();

  // データベース（スプレッドシート）の情報を取得
  var data = sheet.getRange(row, HASH_COL).getValue();

　// 投稿するメッセージ
  var message = targetSiteName +" に更新があるようです。\n" + targetUrl;
  var result = "Not Posted";

  if(data != hash) {
    sheet.getRange(row, HASH_COL).setValue(hash);
    result = slackApp.chatPostMessage(channelId, message, {});
  }

  Logger.log(result);
}
