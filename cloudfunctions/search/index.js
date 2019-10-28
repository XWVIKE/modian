// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  let str = event.str;
  try {
    let arr = [];
    let data = await db.collection('article').where({
      title: db.RegExp({
        regexp: str,
        optionse: 'i'
      })
    }).get();
    let hotWord = await db.collection('hotWord').where({ text: event.str }).get();
    if (hotWord.data.length <= 0) {
      await db.collection('hotWord').add({
        data: {
          text: event.str,
          count: 1,
        }
      })
    } else {
      await db.collection('hotWord').where({ text: event.str }).update({
        data: {
          count: _.inc(1)
        }
      })
    }
    if (data.data.length >= 1) {
      for (let i of data.data) {
        let obj = {};
        obj._id = i._id;
        obj.title = i.title;
        obj.text = i.content.text.replace(/[\r\n]/g, "");
        arr.push(obj)
      }
      return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        data: arr
      }
    } else {
      return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        data: 'none'
      }
    }
    
  } catch (e) {
    console.log(e)
  }
};