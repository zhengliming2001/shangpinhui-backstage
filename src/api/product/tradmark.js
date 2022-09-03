// 引入二次封装的axios
import requests from '@/utils/request'

// 获取品牌列表
// url:/admin/product/baseTrademark/{page}/{limit}
// 请求方式:get
// 参数:page(当前页码),limit(每页记录数)
export const reqGetTradmarkList = (page, limit) => {
    return requests({
        // 两个服务器，配置两个代理
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method:'GET'
    })
}

// 添加品牌
// url:/admin/product/baseTrademark/save
// 请求方式:post
// 参数:logoUrl,tmName

// 修改品牌
// url:/admin/product/baseTrademark/update
// 请求方式:put
// 参数:logoUrl,tmName,id

export const reqAddOrUpdateTradmark = (tradmark) => {
    // 如果参数中包含id，即为修改品牌
    if (tradmark.id) {
        return requests({
            url: '/admin/product/baseTrademark/update',
            method: 'PUT',
            data:tradmark
        })
    } else {
        return requests({
            url: '/admin/product/baseTrademark/save',
            method: 'POST',
            data:tradmark
        })
    }
}


//删除品牌
// url:/admin/product/baseTrademark/remove/{id}
// 请求方式:delete
// 参数:id
export const reqDeleteTradmark = (id) => {
    return requests({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method:'DELETE'
    })
}