/**
 * Created by Administrator on 2017/4/22.
 */
let http = require('http');
let fs = require('fs');
let url = require('url');//处理路径的 可以将路径转化成对象转换后的对象，pathname属性就是真正的请求路径，query就是？之后的内容，query默认是字符串，需要转换成对象提供的参数true就可以转换成对象了。
let mime = require('mime');
const FILE_NAME = './index.json';
let listener = function (request,response) {
    let {pathname, query} = url.parse(request.url, true);
    if (pathname == '/') {
        let result = fs.readFileSync('./index.html');
        response.setHeader("Content-Type", "text/html;charset = UTF-8");
        return response.end(result);
    }

    let result = fs.readFileSync(FILE_NAME,'UTF-8');//最后我们要操作读出来的数据，所以必须要让读出来的内容转换成字符串
    //如果没有用户，读取到的是空字符串，如果没有，返回空数组；
    result = result.length == 0 ? [] : JSON.parse(result);

    let final = {code:0,msg:'成功',data:''};

    //获取所有用户
    if(pathname == '/getList'){
        final.data = result;
        final.msg = '查询成功！';
        response.setHeader('Content-Type','text/json;charset = UTF-8');
        response.end(JSON.stringify(final));
        return;//防止代码向下继续执行
    }

    //删除用户
    if(pathname == '/removeInfo'){
        //1.获取要删除的id
        let id = query.id;
        final.msg = '删除失败';
        final.code = 1;
        for(let i = 0; i <result.length ; i++){
            let data = result[i];
            if(data.id == id){
                result.splice(i,1);//将result写入到json中
                fs.writeFileSync(FILE_NAME,JSON.stringify(result));
                final.msg = '删除成功！';
                final.code = 0;
                break;
            }
        }
        response.setHeader('Content-Type','text/json;charset = UTF-8');
        response.end(JSON.stringify(final));
        return;
    }

    //增加用户
    if(pathname == '/addInfo'){
        //接收请求体中的数据
        let str = '';
        request.on('data',function (data) {//数据到来时触发的函数
            str += data;
        });
        request.on('end',function () {
            let u = JSON.parse(str);///将u放到result中
            u.id = result.length == 0 ? 1 : result[result.length-1].id + 1;
            result.push(u);
            fs.writeFileSync(FILE_NAME,JSON.stringify(result));
            response.setHeader('Content-Type','text/json;charset = UTF-8');
            final.msg = '增加成功';
            response.end(JSON.stringify(final));
        });
        return;
    }

    //获取用户信息
    if(pathname == '/getInfo'){
        //获取传递过来的id
        let id = query.id;
        final.code =1;
        final.msg ='查询的该名用户不存在';
        for(var i = 0;i<result.length;i++){
            let cur = result[i];
            if(id == cur.id){
                final.code =0;
                final.msg ='查询的该名用户找到了';
                final.data = cur;
                break;
            }
        }
        response.setHeader('ContentType','text/json;charset = UTF-8');
        response.end(JSON.stringify(final));
        return;
    }

    //修改用户信息
    if(pathname == '/updateInfo'){
        //获取id和请求体中的数据
        let id = query.id;
        let str = '';
        request.on('data',function (data) {
            str += data;
        });
        request.on('end',function () {
            let u = JSON.parse(str);
            final.code = 1;
            final.msg = '没有查找到该用户';
            for (let i = 0;i<result.length;i++){
                let cur = result[i];
                if(id == cur.id){
                    result[i] = u;//不能写cur = u,要改的是result而不是cur.
                    final.code = 0;
                    final.msg = '修改成功';
                    fs.writeFileSync(FILE_NAME,JSON.stringify(result));
                    break;
                }
            }
            response.setHeader('Content','text/json;charset = UTF-8');
            response.end(JSON.stringify(final));
        });
        return;
    }

    try {
        response.setHeader("Content-Type", mime.lookup(pathname) + ";charset = UTF-8");
        let result = fs.readFileSync('.' + pathname);
        response.end(result);
    }
    catch (e){
        response.statusCode = 404;
        response.end("Not Found");
    }
};
http.createServer(listener).listen(8008,function () {
    console.log("Port8008 is ready!!!");
});