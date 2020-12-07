const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const fs = require("fs");
const path = require('path');

const articlerouters = new Router()


// 获取最近的文章列表
articlerouters.get('/getArticles', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    // const sql = `select * from article order by id desc`
    const sql = `select * from article a,sort b,label c
                where a.sortid =b.sortid and a.labelid =c.labelid order by id desc limit 7`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取所有的文章
articlerouters.get('/getAllArticles', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from article a,sort b,label c
                    where a.sortid =b.sortid and a.labelid =c.labelid order by id desc`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取文章总量
articlerouters.get('/getArticlesCount', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select count(*) from article;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 分页获取文章
articlerouters.get('/getPagingArticles/:pageSize/:curPage', async function (ctx) {
    let pageSize = ctx.params.pageSize  //一页多少条记录
    let curPage = ctx.params.curPage    //当前的页数

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from article a,sort b,label c
                where a.sortid =b.sortid and a.labelid =c.labelid 
                order by id desc limit ${(curPage-1)*pageSize},${pageSize};`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 通过标签/分类获取文章
articlerouters.get('/getlist/:category/:name', async function (ctx) {
    let category = ctx.params.category
    let name = ctx.params.name

    let categorysql = category==='label'?`c.labelname = '${name}'`:`b.sortname = '${name}'`

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from article a,sort b,label c
                    where a.sortid =b.sortid and a.labelid =c.labelid and ${categorysql}
                    order by id desc`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取所有的分类
articlerouters.get('/getAllSorts', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from sort`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 删除分类
articlerouters.post('/deleteSort', async function (ctx) {
    const id = ctx.request.body.sortid

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `DELETE FROM sort where sortid = '${id}'`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        // arr:rs,
        code:200,
    };
});

// 获取所有的标签
articlerouters.get('/getAllLabels', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from label`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取分类云内容
articlerouters.get('/getSortCloud', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select b.sortname , count(a.sortid) as count
                from article a ,sort b 
                WHERE a.sortid = b.sortid GROUP BY a.sortid;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取标签云内容
articlerouters.get('/getLabelCloud', async function (ctx) {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select b.labelname , count(a.labelid) as count
                from article a ,label b 
                WHERE a.labelid = b.labelid GROUP BY a.labelid;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 删除标签
articlerouters.post('/deleteLabel', async function (ctx) {
    const id = ctx.request.body.labelid

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `DELETE FROM label where labelid = '${id}'`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        // arr:rs,
        code:200,
    };
});

// 修改文章信息
articlerouters.post('/changeArticle', async function (ctx) {
    const id = ctx.request.body.id
    const title = ctx.request.body.title
    const detail = ctx.request.body.detail
    // 至少一位数字
    let numberflag = /^\d{1,}$/
    const sortid = numberflag.test(ctx.request.body.sortname)?ctx.request.body.sortname:ctx.request.body.sortid
    const labelid = numberflag.test(ctx.request.body.labelname)?ctx.request.body.labelname:ctx.request.body.labelid

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE article SET title = '${title}' , detail = '${detail}' ,
                sortid = '${sortid}' , labelid = '${labelid}'
                WHERE id = '${id}';`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 修改分类
articlerouters.post('/changeSort', async function (ctx) {
    const sortid = ctx.request.body.sortid
    const sortname = ctx.request.body.sortname

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE sort SET sortname = '${sortname}' WHERE sortid = '${sortid}';`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 修改标签
articlerouters.post('/changeLabel', async function (ctx) {
    const labelid = ctx.request.body.labelid
    const labelname = ctx.request.body.labelname

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE label SET labelname = '${labelname}' WHERE labelid = '${labelid}';`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 增加分类
articlerouters.post('/addSort', async function (ctx) {
    const sortname = ctx.request.body.name

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO sort ( sortname ) VALUES ( '${sortname}');`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 增加标签
articlerouters.post('/addLabel', async function (ctx) {
    const labelname = ctx.request.body.name

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO label ( labelname ) VALUES ( '${labelname}');`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 文件上传接口
articlerouters.post('/uploadfile', async (ctx, next) => {
    // 测试上传路径的获取
    let title = ctx.request.body.title
    let detail = ctx.request.body.detail
    let datetime = ctx.request.body.datetime
    let sortid = ctx.request.body.sortid
    let labelid = ctx.request.body.labelid

    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件

    // // 将文件信息写入数据库
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO article ( title, detail , date , sortid , labelid , mdname ) 
                VALUES ( '${title}', '${detail}','${datetime}',
                ${sortid} , ${labelid} ,'${file.name}');`
    const [rs] = await connection.query(sql);
 
    connection.end(function(err){
        //连接结束
    })

    // 创建可读流
    const reader = fs.createReadStream(file.path);

    let filePath = path.join(__dirname+'/static/') + `${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.body = {
        message:"上传成功！",
        code:200,
        };
  });
  
// 获取文章
articlerouters.get('/readarticle/:id', async function (ctx) {
    let id = ctx.params.id

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select * from article where id = ${id};`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 文章发表接口
articlerouters.post('/publisharticle', async (ctx, next) => {
    // 测试上传路径的获取
    let title = ctx.request.body.title
    let detail = ctx.request.body.detail
    let datetime = ctx.request.body.datetime
    let sortid = ctx.request.body.sortid
    let labelid = ctx.request.body.labelid
    let content = ctx.request.body.content

    // 将文件信息写入数据库
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO article ( title, detail , date , sortid , labelid , content ) 
                VALUES ( '${title}', '${detail}','${datetime}',${sortid} , ${labelid} ,'${content}');`
    const [rs] = await connection.query(sql);
 
    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        message:"上传成功！",
        code:200,
        };
  });

// 删除文章
articlerouters.post('/deleteArticles', async function (ctx) {
    const id = ctx.request.body.id

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `DELETE FROM article where id = '${id}';`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取自我介绍
articlerouters.get('/getme', async function (ctx) {

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select * from me where id = 1;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 修改自我介绍
articlerouters.post('/updateme', async function (ctx) {
    const content = ctx.request.body.me

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE me SET content = '${content}' WHERE id = 1;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 修改文章内容
articlerouters.post('/updateArticles', async function (ctx) {
    const id = ctx.request.body.id
    const content = ctx.request.body.content

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE article SET content = '${content}' where id = ${id};`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 搜索文章
articlerouters.post('/searchArticles', async function (ctx) {
    const title = ctx.request.body.title

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * from article a,sort b,label c
    where a.sortid =b.sortid and a.labelid =c.labelid and a.title LIKE '%${title}%' order by id desc;`
    const [rs] = await connection.query(sql);

    connection.end(function(err){
        //连接结束
    })

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

module.exports = articlerouters