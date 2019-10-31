// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;

function sort(key) {
  return function(o1, o2) {
    let v1 = o1[key];
    let v2 = o2[key];
    return v2 - v1
  }
};
exports.main = async(event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  try {
    let temp = await db.collection('hotArt').where({
      num: _.lte(100)
    }).get();
    let data = [];
    for (let i of temp.data) {
      let promise = db.collection('article').doc(i._id).get();
      data.push(promise);
    };
    let artData = await Promise.all(data);
 
    let hotWord = await db.collection('hotWord').where({
      count: _.gte(0)
    }).get();

    let arr = hotWord.data.sort(sort("count"));
    return {
      event,
      data: artData,
      hotWord: arr.splice(0, 6),
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      env: wxContext.ENV,
    }
  } catch (e) {
    console.log(e)
  };
}