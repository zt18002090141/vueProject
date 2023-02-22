import axios from 'axios'
import Element from 'element-ui'
import router from '@/router'

// axios.defaults.baseURL='http://localhost:10001/'
axios.defaults.baseURL='/api'
const request = axios.create({
    timeout: 5000,
    // headers: {
    //     'Content-Type': 'application/json;charset=utf-8'
    // }
})

request.interceptors.request.use(config => {
    config.headers['token'] = localStorage.getItem('token')
    return config
})

//设置axios响应拦截器
request.interceptors.response.use(response => {
    let res = response.data
    if (res.code == 200) {
        return response
    } else {
        Element.Message({
            showClose: true,
            message: res.message ? res.message : '操作异常',
            type: 'error'
        })
        return Promise.resolve(console.error.message)
    }
}, error => {
    Element.Message({
        showClose: true,
        message: error.message,
        type: 'error'
    })
    return Promise.resolve(error)
})

export default request