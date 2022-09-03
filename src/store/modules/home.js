import mockRequest from '@/utils/mockRequest'
export default {
    state: {
        list:{}
    },
    mutations: {
        GETLIST(state,list) {
            state.list=list
        }
    },
    actions: {
        async getList({commit}) {
            let result = await mockRequest.get('/home/list')
            commit('GETLIST',result.data)
        }
    },
    getters:{}
}