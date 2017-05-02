/**
 * Created by Administrator on 2017/4/22.
 */
//获取所有数据，得到数据后插入到表格中
var module = (function () {
    var tBody = document.getElementById('tBody');

    function bindHTML(res) {
        var str = '';
        for (var i = 0; i < res.data.length; i++) {
            var cur = res.data[i];
            str += '<tr>';
            str += '<td>'+(i+1)+'</td>';
            str += '<td>'+cur.name+'</td>';
            str += '<td>'+cur.age+'</td>';
            str += '<td>'+cur.phone+'</td>';
            str += '<td>'+cur.address+'</td>';
            str += '<td><a href="javascript:void 0" data-id="'+cur.id+'">删除</a></td>';
            str += '<td><a href="/detail.html?id='+cur.id+'">修改</a></td>';
            str += '</tr>';
        }
        tBody.innerHTML = str;
    }
    function bindEvent() {
        tBody.onclick = function (e) {
            e = e || window.event;
            var ele = e.target || e.srcElement;
            if(ele.tagName == "A" && ele.innerHTML == '删除'){
                var id = ele.getAttribute('data-id');
                var flag = confirm('你确定删除id为'+id+'的用户么');
                if(flag){
                    ajax({
                        url:'/removeInfo?id='+id,
                        dataType:'json',
                        success:function (res) {//在这里移除dom元素
                            if(res && res.code == 0){
                                ele.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode);
                            }else {
                                alert(res.msg);
                            }
                        }
                    });
                }
            }
        }
    }
    function init() {//获取所有数据
        ajax({
            url:'/getList',
            dataType:'json',
            success:function (res) {//res代表最终的响应结果
                if (res && res.code == 0) {
                    bindHTML(res);//将获取的数据展示到表体中
                    bindEvent();//事件委托方式，添加事件
                }
            }
        });
    }
    return{
        init : init
    }
})();
module.init();