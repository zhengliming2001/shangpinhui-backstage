// 引入发送请求的函数
import requests from '@/utils/request';

// 获取spu数据列表
// url:/admin/product/{page}/{limit}
// 请求方式:get
// 参数:page,limit,category3Id(params)
export const reqGetSpuList = (page,limit,category3Id) => {
    return requests({
        url: `/admin/product/${page}/${limit}`,
        method: 'GET',
        params: {
            category3Id
        }
    })
}

// 获取spu基本信息
// url:/admin/product/getSpuById/{spuId}
// 请求方式:GET
// 参数:spuId
export const reqGetSpu = (spuId) => {
    return requests({
        url: `/admin/product/getSpuById/${spuId}`,
        method:'GET'
    })
}

// 获取品牌信息
// url:/admin/product/baseTrademark/getTrademarkList
// 请求方式:GET
export const reqGetTrademarkList = () => {
    return requests({
        url: `/admin/product/baseTrademark/getTrademarkList`,
        method:'GET'
    })
}

// 获取销售属性信息(三个)
// url:/admin/product/baseSaleAttrList
// 请求方式:GET
export const reqGetMarketAttr = () => {
    return requests({
        url: `/admin/product/baseSaleAttrList`,
        method:'GET'
    })
}

// 获取spu图片
// url:/admin/product/spuImageList/{spuId}
// 请求方式:GET
export const reqGetSpuImg = (spuId) => {
    return requests({
        url: `/admin/product/spuImageList/${spuId}`,
        method:'GET'
    })
}

// 添加或修改spu
// 添加url:/admin/product/saveSpuInfo
// 修改url:/admin/product/updateSpuInfo
// 请求方式:post
// 参数:data
// 根据data中是否存在id区分添加还是修改(有id的为修改)
export const reqaddOrUpdateSpu = (data) => {
    if (data.id) {
        return requests({
            url: '/admin/product/updateSpuInfo',
            method: 'POST',
            data
        })
    }
    return requests({
        url: '/admin/product/saveSpuInfo',
        method: 'POST',
        data
    })
}

// 删除spu
// url:/admin/product/deleteSpu/{spuId}
// 请求方式:delete
export const reqDeleteSpu = (spuId) => {
    return requests({
        url: `/admin/product/deleteSpu/${spuId}`,
        method:'DELETE'
    })
}

// 获取spu图片列表
// url:/admin/product/spuImageList/{spuId}
// 请求方式:get
// 参数:spiId
export const reqGetSpuImgList = (spuId) => {
    return requests({
        url: `/admin/product/spuImageList/${spuId}`,
        method:'GET'
    })
}

// 获取spu的销售属性列表
// url:/admin/product/spuSaleAttrList/{spuId}
// 请求方式:GET
// 参数:spuId
export const reqGetSpuSaleAttrList = (spuId) => {
    return requests({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method:'GET'
    })
}

// 获取属性列表
// url:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 请求方式:GET
// 参数:category1Id,category2Id,category3Id
export const reqGetAttrInfoList = (category1Id,category2Id,category3Id) => {
    return requests({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'GET'
    })
}

// 添加sku
// url:/admin/product/saveSkuInfo
// 请求方式:post
// 参数:skuInfo(data)
export const reqAddSku = (data) => {
    return requests({
        url: '/admin/product/saveSkuInfo',
        method: 'POST',
        data
    })
}

// 获取sku列表数据
// url:/admin/product/findBySpuId/{spuId}
// 请求方式:get
// 参数:spuId
export const reqGetSkuList = (spuId) => {
    return requests({
        url: `/admin/product/findBySpuId/${spuId}`,
        method:'GET'
    })
}