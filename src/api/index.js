// 引入product下各个文件暴露的所有发送请求函数

import * as tradmark from './product/tradmark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

import * as permission from './acl/permission'
import * as role from './acl/role'
import * as user from './acl/user'

// 统一暴露出去
export default {
    tradmark,
    attr,
    sku,
    spu,
    permission,
    role,
    user
}