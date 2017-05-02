/**
 * Created by Administrator on 2017/4/22.
 */
~function(){//自执行函数的特点：私有化
    function getXHR(){
        let xhr = null;
        let ary = [function(){
            return new XMLHttpRequest;
        },function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },function () {
            return  new ActiveXObject("Msxml3.XMLHTTP");
        }];
        for (var i = 0 ; i < ary.length ; i++){
            let cur = ary[i];
            try {//try catch 只支持同步，不支持异步
                xhr = cur();
                getXHR = cur;//找到后，将原有函数替换掉.惰性载入函数，第一次执行判断，以后不再执行原函数。
                break;
            }catch (e){}
        }
        if(xhr == null){
            throw Error('您的浏览器版本太老了，快快更新您的浏览器！！！');//会中断程序的执行
        }
        return xhr;//返回XHR对象
    }
     function ajax(options){
        let _defaultOptions = {
            url : '',
            type : 'get',
            dataType : 'json',
            data : null,
            async : true,
            cache : true,
            success : null
        };
        for( attr in options){
            if(options.hasOwnProperty(attr)){
                _defaultOptions[attr] = options[attr];
            }
        }
        let xhr = getXHR();
        xhr.open(_defaultOptions.type,_defaultOptions.url,_defaultOptions.async);
        if( _defaultOptions.type.toUpperCase() == 'GET' && !_defaultOptions.cache){
            if(_defaultOptions.url.indexOf('?')>(-1)){
                _defaultOptions.url += '&_ran=' + Math.random();
            }else {
                _defaultOptions.url += '?_ran=' + Math.random();
            }
        }
        xhr.responseType = _defaultOptions.dataType;
        xhr.onreadystatechange = function () { //异步ajax 通过回调函数处理
            if(this.readyState == 4 && /^2\d{2}/.test(this.status)){
                //执行外界传递过来的函数，将数据传入
                 _defaultOptions.success.call(this,this.response);
            }
        };
        xhr.send(_defaultOptions.data);
    }
    window.ajax = ajax;
}();