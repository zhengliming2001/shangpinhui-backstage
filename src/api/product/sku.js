// 引入axios
import requests from '@/utils/request'

// 获取sku列表
// url:/admin/product/list/{page}/{limit}
// 请求方式:get
// 参数:page,limit
export const reqGetSkuList = (page, limit) => {
    return requests({
        url: `/admin/product/list/${page}/${limit}`,
        method: 'GET'
    })
}

// 上架
// url:/admin/product/onSale/{skuId}
// 请求方式:GET
// 参数:skuId
export const reqOnSale = (skuId) => {
    return requests({
        url: `/admin/product/onSale/${skuId}`,
        method: 'GET'
    })
}

// 下架
// url:/admin/product/cancelSale/{skuId}
// 请求方式:GET
// 参数:skuId
export const reqCancelSale = (skuId) => {
    return requests({
        url: `/admin/product/cancelSale/${skuId}`,
        method: 'GET'
    })
}

// 获取skuinfo
// url:/admin/product/getSkuById/{skuId}
// 请求方式:GET
// 参数:skuId
export const reqGetSkuInfo = (skuId) => {
    return requests({
        url: `/admin/product/getSkuById/${skuId}`,
        method: 'GET'
    })
}