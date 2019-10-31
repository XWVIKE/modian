// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = event.openid;
  try{
    let data = await db.collection('article').where({
      _openid:_openid
    }).get();
    let arr = [];
    if(data.data.length<=0){
      return{
        data:[]
      }
    }else{
      for (let i of data.data) {
        let obj = {};
        obj.titleImage = i.titleImage,
        obj.title = i.title,
        obj._id = i._id,
        obj.text = i.content.text.replace(/[\r\n]/g, "");
        arr.push(obj);
      }
      return{
        data:arr.reverse()
      }
    }
    
  }catch(e){
    console.log(e)
  }
}