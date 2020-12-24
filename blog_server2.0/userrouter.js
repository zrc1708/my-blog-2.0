const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js')// 导入数据库登录信息
const jwt = require('jsonwebtoken')
const path = require('path');
const fs = require("fs");

const userrouter = new Router()

//查询用户名接口
userrouter.post('/getusername', async ctx => {
    const username = ctx.request.body.username;   

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where username = '${username}'`;
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    ctx.body = {
        code:200,
        'rs':rs.length
    }
});

//根据用户名和密码查询用户信息接口(普通用户通道)
userrouter.post('/blogcheckuser', async ctx => {
    const username = ctx.request.body.username;        
    const password = ctx.request.body.password;        

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where username = '${username}' and password= '${password}' and state = '0';`
    const [rs] = await connection.query(sql);

    if(rs.length===1){
        let userToken = {
            username,
            id: rs[0].id,
        }
        let secret = 'niconiconi' // 指定密钥
        let token = jwt.sign(userToken, secret, { expiresIn: '168h' }) // 签发token

        let time = new Date().Format("yyyy-MM-dd hh:mm:ss")

        const sql2 = `UPDATE user SET token = '${token}',logintime = '${time}' WHERE id = '${rs[0].id}';`
        await connection.query(sql2);

        ctx.cookies.set('token', token, {
            maxAge: 1000 * 60 * 60 * 24 *7,
            httpOnly: true,
            overwrite: true
        })

        ctx.body = {
            rs,
            // token,
            code:200
        }
    }else{
        ctx.body = {
            message:'登录失败',
            code:201
        }
    }

    connection.end(function(err){})
});

// 自动登录
userrouter.post('/automaticlogin', async ctx => {
    const token = ctx.cookies.get('token');        
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where token = '${token}'`;
    const [rs] = await connection.query(sql);
    
    if(rs.length===1){
        let userToken = {
            username:rs[0].username,
            id: rs[0].id,
        }
        let secret = 'niconiconi' // 指定密钥
        let token = jwt.sign(userToken, secret, { expiresIn: '168h' }) // 签发token

        let time = new Date().Format("yyyy-MM-dd hh:mm:ss")

        const sql2 = `UPDATE user SET token = '${token}',logintime = '${time}' WHERE id = '${rs[0].id}' and state = '0';`
        await connection.query(sql2);

        ctx.cookies.set('token', token, {
            maxAge: 1000 * 60 * 60 * 24 *7,
            httpOnly: true,
            overwrite: true
        })

        ctx.body = {
            rs,
            code:200
        }
    }else{
        ctx.body = {
            message:'登录失败',
            code:201
        }
    }
    connection.end(function(err){})
});

//根据用户名和密码查询用户信息接口(管理员通道)
userrouter.post('/checkuser', async ctx => {
    const username = ctx.request.body.username;        
    const password = ctx.request.body.password;        
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where username = '${username}' and password= '${password}' and userlevel = 1`;
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    if(rs.length===1){
        let userToken = {
            username,
            id: rs[0].id,
        }
        let secret = 'niconiconi' // 指定密钥
        let token = jwt.sign(userToken, secret, { expiresIn: '24h' }) // 签发token
        ctx.body = {
            rs,
            token,
            code:200
        }
    }else{
        ctx.body = {
            message:'登录失败',
            code:201
        }
    }
});

// 用户注册接口
userrouter.post('/adduser', async function (ctx) {
    const username = ctx.request.body.username;        
    const password = ctx.request.body.password;  
    const time = new Date().Format("yyyy-MM-dd hh:mm:ss");

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO user ( username,password,birthtime) VALUES ( '${username}','${password}','${time}');`
    const [rs] = await connection.query(sql);

    connection.end(function(err){})

    // 为用户初始化文件夹
    const filePath = path.join(__dirname,'files',username)
    fs.mkdirSync(filePath);

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取用户总量
userrouter.get('/getalluserscount', async function (ctx) {
    
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select count(*) from user;`
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    return ctx.body = {
        rs,
        code:200,
    };
});

// 获取所有用户接口
userrouter.get('/getalluser/:pageSize/:curPage', async function (ctx) {
    let pageSize = ctx.params.pageSize  //一页多少条记录
    let curPage = ctx.params.curPage    //当前的页数

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from user where id != 1
                order by id desc limit ${(curPage-1)*pageSize},${pageSize};`
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 封禁用户
userrouter.post('/deleteuser', async function (ctx) {
    const userid = ctx.request.body.userid;

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE user SET state = '1' WHERE id = '${userid}';`
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 解封用户
userrouter.post('/changeuser', async function (ctx) {
    const userid = ctx.request.body.userid;

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE user SET state = '0' WHERE id = '${userid}';`
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

module.exports = userrouter
