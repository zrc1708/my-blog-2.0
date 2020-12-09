module.exports={
    chainWebpack:config =>{
        config.set('externals', {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            axios: 'axios'
        })
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8877/',
                pathRewrite: {
                    '^/api': '' // 替换掉代理地址中的 /api
                },
                changeOrigin: true // 确保请求 GitHub 的主机名就是：api.github.com
            }
        }
    },
    publicPath: './',  //输出的根路径  默认是/ 如果你的网站是app.com/vue 这更改此配置项
}