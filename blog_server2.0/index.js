(async function run() {
    var fs = require('fs')
    //加载依赖
    const Koa = require('koa'); //引入koa框架
    const Static = require('koa-static-cache'); //引入koa静态资源依赖
    const Router = require('koa-router'); //引入koa路由
    const Bodyparser = require('koa-bodyparser');//加载body解析依赖
    const cors = require('koa2-cors')//引入跨域依赖
    const koaBody = require('koa-body');

    const jwt = require('jsonwebtoken')

    const app = new Koa(); //类似于实例化
    app.use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 20000*1024*1024    // 设置上传文件大小最大限制，默认200M
        }
    }));
    app.use(cors());//解决跨域问题
    
    app.use(async(ctx, next)=> {
        var token = ctx.headers.authorization;
        if (ctx.request.url!=='/deleteArticles'&&
            ctx.request.url!=='/deleteSort'&&
            ctx.request.url!=='/changeArticle'&&
            ctx.request.url!=='/changeSort'&&
            ctx.request.url!=='/changeLabel'&&
            ctx.request.url!=='/addSort'&&
            ctx.request.url!=='/addLabel'&&
            ctx.request.url!=='/uploadfile'&&
            ctx.request.url!=='/deleteLabel'&&
            ctx.request.url!=='/getuser') {
            return await next();
        }else if(!token){
            return ctx.body={
                code:'444',
                message:"该功能只有登录用户可以使用",
            }
        }else{
            jwt.verify(token,'niconiconi',(error,decoded)=>{
                if(error){
                    return ctx.body={
                        code:'445',
                        message:"token无效",
                    }
                }
            })
            await next();
        }
    })

    //加载静态资源
    app.use(Static('./static', {
        prefix: '/static',
        gzip: true
    }));

    const router = new Router();//路由


    const articlerouter = require('./blog.js')
    const userrouter = require('./userrouter.js')

    app.use(router.routes());//挂载路由
    app.use(articlerouter.routes());
    app.use(userrouter.routes());


    app.listen(8877, () => {});

})();