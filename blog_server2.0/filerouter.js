const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const fs = require("fs");
const path = require('path');
const send = require('koa-send');

const filerouter = new Router()

//文件大小格式转换 
var getsize = function(val){
    if(val.length<=3){
        return val+' b'
    }else if(val.length<=6){
        return val.substring(0,val.length-3)+' kb'
    }else{
        return val.substring(0,val.length-6)+' mb'
    }
}

// 递归删除文件夹
function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

//  生成提取码
function generateMixed(n) {
    // 去除了容易混淆的字符
    let chars = ['2','3','4','5','6','7','8','9',
                'A','B','C','D','E','F','G','H','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];

    let res = "";
    for(let i = 0; i < n ; i ++) {
        let id = Math.ceil(Math.random()*(chars.length-1));
        res += chars[id];
    }
    return res;
}

//查询所有文件
filerouter.post('/getfile', async ctx => {

    let userpath
    if(typeof ctx.request.body.path == 'string'){
        userpath = ctx.request.body.path.split(',')
    }else{
        userpath = ctx.request.body.path
    }
    
    // 获取进行文件查找的路径
    userpath.unshift(__dirname,'files')

    //设置根目录
    const root = path.join(...userpath);

    var arr = [];
    //调用函数遍历根目录，同时传递 文件夹路径和对应的数组
    //请使用同步读取
    fileDisplay(root, arr);

    function fileDisplay(dirPath, arr) {
        var filesList = fs.readdirSync(dirPath);
        for (var i = 0; i < filesList.length; i++) {
            //描述此文件/文件夹的对象
            var fileObj = {};
            fileObj.name = filesList[i];
            //拼接当前文件的路径(上一层路径+当前file的名字)
            var filePath = path.join(dirPath, filesList[i]);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            var stats = fs.statSync(filePath);
            fileObj.size = getsize(stats.size+'')
            fileObj.path = filePath
            fileObj.birthtime = stats.birthtime
            if (stats.isDirectory()) {
                //如果是文件夹
                fileObj.type = 'dir';
                fileObj.child = [];
                arr.push(fileObj);
                //如需递归遍历子文件，使用下行
                // fileDisplay(filePath, arr[i].child);
            } else {
                //不是文件夹,则添加type属性为文件后缀名
                fileObj.type = path.extname(filesList[i]).substring(1);
                arr.push(fileObj);
            }
        }
    }
    ctx.body={
        arr,
        code:200
    }
});

// 文件上传接口
filerouter.post('/uploadfile', async (ctx, next) => {
    // 上传路径的获取
    const savepath = ctx.request.body.savePath.split(',')
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // 用户的id
    const id = ctx.request.body.userid

    if(file.name.indexOf(',')!==-1){
        return ctx.body = {
            message:"文件名非法",
            code:400,
        };
    }

    // 创建可读流
    const reader = fs.createReadStream(file.path);

    savepath.unshift(__dirname,'files')
    savepath.push(file.name)

    let filePath = path.join(...savepath);
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);

    // 准备数据库所需的文件类型和大小
    let category = file.name.split('.')[file.name.split('.').length-1]
    let size = getsize(file.size+'')

    // 链接数据库
    const connection = await Mysql.createConnection(mysql_nico)

    // 生成唯一的提取码
    let sql = `Select code from files ;`
    let [rs] = await connection.query(sql);
    let codeArr = rs.map(item=>{
        return item.code
    })
    let code = generateMixed(4)
    while (codeArr.indexOf(code)!==-1) {
        code = generateMixed(4)
    }

    // 准备数据库用的文件路径
    let sqlFilePath = './files'
    ctx.request.body.savePath.split(',').forEach(item=>{
        sqlFilePath=sqlFilePath+'/'+item
    })
    sqlFilePath=sqlFilePath+'/'+file.name

    sql = `INSERT INTO files ( name, path , type , size ,userid ,code) 
                VALUES ( '${file.name}', '${sqlFilePath}','${category}','${size}', '${id}','${code}');`
    const [rs2] = await connection.query(sql);
    connection.end(function(err){})

    return ctx.body = {
        message:"上传成功！",
        code:200,
    };
});

//创建文件夹接口
filerouter.post('/mkdir', async ctx => {
    const userpath = ctx.request.body.path; 
    userpath.unshift(__dirname,'files')
    let filePath = path.join(...userpath);

    let code=200
    try {
        fs.mkdirSync(filePath,);
    } catch (error) {
        if(error.code=='EEXIST'){
            code=400
        }
    }
    
    ctx.body={
        code
    }
});

// 重命名文件接口
filerouter.post('/rename', async function (ctx) {
    const oldname = ctx.request.body.oldname
    const newname = path.join(...ctx.request.body.newname)
    const name = ctx.request.body.name
    const userid = ctx.request.body.userid

    console.log(oldname);

    // 检测新文件名是否重名
    try {
        fs.readFileSync(newname);
    } catch (error) {
        if(error.code =='ENOENT'){
            
            await fs.rename(oldname.trim(),newname.trim(),(error) => {
                if (error) {
                    throw error
                } 
            })

            // 更改文件数据库状态
            // const newfilename = ctx.request.body.newname[ctx.request.body.newname.length-1]
            // const connection = await Mysql.createConnection(mysql_nico)
            // const sql = `UPDATE files SET name = '${newfilename}' 
            //             WHERE path = '${oldname}' and name = '${name}' and userid = '${userid}';`
            // const [rs] = await connection.query(sql);
            // connection.end(function(err){})

            return ctx.body ={
                code:200
            }
        }
    }

    ctx.body ={
        code:400
    }    
});

// 删除文件接口
filerouter.post('/remove', async function (ctx) {
    const path = ctx.request.body.path
    const type = ctx.request.body.type

    let sqlpath = path.replace('E:\\Desktop\\my-blog-2.0\\blog_server2.0\\','./').replace(/\\/g,'/')
    // 更改文件数据库状态
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `DELETE FROM files
                WHERE path like '${sqlpath}%'`
    const [rs] = await connection.query(sql);
    connection.end(function(err){})

    if(type==='dir'){
        await delDir(path);//删除文件夹
    }else{
        await fs.unlink(path.trim(), (err) => {
            if (err) throw err;
        });
    }
    return ctx.body = {
        message:"删除文件成功！",
        code:200,
    };
});

// 获取所有文件
filerouter.get('/getallfilesbysql', async function (ctx) {

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select * from files ;`
    const [rs] = await connection.query(sql);

    return ctx.body = {
        rs,
        code:200,
    };
});

// 提取文件
filerouter.post('/getfilebycode', async function (ctx) {
    const code = ctx.request.body.code

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `Select * from files where code = '${code}';`
    const [rs] = await connection.query(sql);

    return ctx.body = {
        rs,
        code:200,
    };
});

// 文件下载
filerouter.get('/downloadfile', async function (ctx) {
    let path = ctx.query.path
    let name = ctx.query.name
    path = path.slice(1).replace(`/${name}`,'')

    ctx.attachment(name);
    await send(ctx, name, { root: __dirname +path});
});

module.exports = filerouter