// 引入数据
const data = require('./data.json')
// 向外暴露的数据
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data
      }
    }
  }
]
