const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档

// 随机生成文章数据
const postData = req => {

  console.log(req) // 请求体，用于获取参数

  let data = [] // 用于存放文章数据的数组

  for (let i = 0; i < 10; i++) {
    let post = {
      actId: 578,
      actPrizeId: 630,
      address: "南京",
      createTime: "2020-10-08 13:38:26",
      id: 2965,
      phone: "123456789",
      prizeCellIndex: Random.integer(1,7),
      prizesDesc: "毛绒玩具",
      prizesName: "毛绒玩具",
      prizesStatus: 1,
      prizesType:Random.integer(1,7),
      prizesTypeName: "实物",
      realname: "张三",
      seq: "MK202010081338266031841spKAzd",
      userId: "U202007081538496510023hTm2oE",

      // title: Random.csentence(10, 25), // 随机生成长度为10-25的标题
      // icon: Random.dataImage('250x250', '文章icon'), // 随机生成大小为250x250的图片链接
      // author: Random.cname(), // 随机生成名字
      // date: Random.date() + ' ' + Random.time() // 随机生成年月日 + 时间
    }

    data.push(post)
  }

  // 返回状态码和文章数据posts
  return {
    code: "0000",
    data,
    messgae: "成功"
  }
}

// 定义请求链接，类型，还有返回数据
Mock.mock(`api/record`, 'get', postData);

// export default {
//     'GET /act/lottery/act/record': (req, res) => {
//         const {
//             page,
//             size,
//         } = req.query;
//         let data = {}
//         data = mockjs.mock({
//             'data|137': [{
//                 'key|+1': 1,
//                 name: '@cname',
//                 'age|1-100': 20,
//                 city: '@city',
//                 province: "@province",
//                 hobby: /吃饭|睡觉/,
//                 cityArr:[]
//             }],
//         });

//         res.status(200).send({
//             data: {
//                 data: data.data,
//                 current: +page || 1,
//                 pageSize: +size || 10,
//                 total: data.data.length,
//             },
//             httpStatus: 200,
//             msg: '查询成功',
//         });
//     },
// };
