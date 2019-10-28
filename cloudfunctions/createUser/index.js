// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = event.openid;
  try {
    let data = await db.collection('user').where({
      openId: openId
    }).get();
    if (data.data.length <= 0) {
     await db.collection('user').add({
        data: {
          openId: openId,
          userName: event.userName
        },
      });
      return{
        data:{code:200}
      }
    } else {
      return {
        data: {
          code: 200
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}