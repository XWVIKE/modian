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

  function fuck(key) {
    return function(o1, o2) {
      let v1 = o1[key];
      let v2 = o2[key];
      return v2 - v1;
    }
  };
  try {
    await db.collection('hotArt').where({
      num:_.lte(100)
    }).remove();
    
    let temp = await db.collection('article').where({
      like: _.gte(0)
    }).get();

    let data = temp.data;
    let allarr = data.sort(fuck("like"));
    let arr = allarr.splice(0,100);
    let task = [];
    for (let i = 0; i < arr.length; i++) {
      let promise = db.collection('hotArt').add({
        data: {
          _id: arr[i]._id,
          _openid: arr[i]._openid,
          like: arr[i].like,
          num: i
        }

      });
      task.push(promise);
    }
    await Promise.all(task)
    console.log(arr)
  } catch (e) {
    console.log(e)
  }

}