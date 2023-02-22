const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const port=80
module.exports={
  devServer:{
    port:port,
    proxy:{
      '/api':{
        target:'http://127.0.0.1:10001',
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
}