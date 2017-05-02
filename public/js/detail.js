/**
 * Created by Administrator on 2017/4/22.
 */
//判断当前url路径是否有id参数，如果有id表示修改，没有id表示增加
//封装一个查询对象的方法
String.prototype.parseQuery = function () {//字符串原型上的方法，所有字符串都可以调用
    var query = {};
    this.replace(/([^?=&]+)=([^?=&]+)/,function () {
/*        console.log(this);
        console.log(arguments);
        {id:3}
        query["id"] = 3*/
        query[arguments[1]] = arguments[2];
    });
    return query;
};
var query = window.location.search.parseQuery();
var oBox = document.getElementById('form');
var oBtn = document.createElement('button');
var id = query.id;
if(id){
    oBtn.innerHTML = '修改';
    //先通过当前id获取当前id的数据
    ajax({
        url:'/getInfo?id='+id,
        dataType:'json',
        success:function (res) {
            if(res && res.code == 0){
                let u = res.data;
                username.value = u.name;
                age.value = u.age;
                phone.value = u.phone;
                address.value = u.address;
            }else {//穿的id不存在，没有办法进行修改
                window.location.href = '/';
            }
        }
    });
}
else {
    oBtn.innerHTML = '添加';
}
oBox.appendChild(oBtn);
//做修改和增加的逻辑
var username = document.getElementById('username');
var age = document.getElementById('age');
var phone = document.getElementById('phone');
var address = document.getElementById('address');
oBtn.onclick = function () {
   if(id){//修改
       //要将id传入过去，传入最新的数据
       ajax({
           type:'put',//put表示修改
           dataType:'json',
           url:'/updateInfo?id='+id,
           data:JSON.stringify({
               id:id,
               name:username.value,
               age:age.value,
               phone:phone.value,
               address:address.value
           }),
           success:function (res) {
               if(res && res.code == 0){
                   window.location.href = '/';
               }
           }
       })
   }
   else{//增加
     ajax({
         url:'/addInfo',
         dataType:'json',
         type:'post',//post是通过请求体里边发送数据
         data:JSON.stringify({
             name:username.value,
             age: age.value,
             phone:phone.value,
             address:address.value
         }),
         success:function (res) {
             if(res && res.code == 0){
                 window.location.href = '/';
             }
         }
     });
   }
};