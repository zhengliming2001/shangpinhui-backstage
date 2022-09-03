// 引入axios
import requests from '@/utils/request'

// 获取一级分类的列表
// url:/admin/product/getCategory1
// 请求方式:get
export const reqGetCategory1List = () => {
    return requests({
        url: '/admin/product/getCategory1',
        method:'GET'
    })
}

// 获取二级分类的列表
// url:/admin/product/getCategory2/{category1Id}
// 参数:category1Id
// 请求方式:get
export const reqGetCategory2List = (category1Id) => {
    return requests({
        url: `/admin/product/getCategory2/${category1Id}`,
        method:'GET'
    })
}

// 获取三级分类的列表
// url:/admin/product/getCategory3/{category2Id}
// 参数:category2Id
// 请求方式:get
export const reqGetCategory3List = (category2Id) => {
    return requests({
        url: `/admin/product/getCategory3/${category2Id}`,
        method:'GET'
    })
}

// 获取属性数据列表
// url:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 请求方式:get
// 参数:category1Id,category2Id,category3Id
export const reqGetAttrList = (category1Id, category2Id, category3Id) => {
    return requests({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'GET'
    })
}

// 添加商品属性
// url:/admin/product/saveAttrInfo
// 请求方式:POST
/* 参数:
 {"attrName": "string",
  "attrValueList": [
    {
      "attrId": 0,
      "id": 0,
      "valueName": "string"
    }
  ],
  "categoryId": 0,
  "categoryLevel": 0,
  "id": 0
} */
export const reqAddOrUpdateAttr = (data) => {
    return requests({
        url: '/admin/product/saveAttrInfo',
        method: 'POST',
        data
    })
}