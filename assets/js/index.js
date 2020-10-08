$(function () {
    // 调用函数
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogOut').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = './login.html'
            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})
// 定义获取用户信息函数
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取信息失败')
            }
            renderAvatar(res.data);
        },
        // ajax函数无论请求失败还是成功时就都会执行complete函数
        // complete :function(res) {
        //     // console.log('执行了complete函数');
        //     // console.log(res);   
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
        //         location.href = './login.html';
        //         localStorage.removeItem('token');
        //     }
        // }
    });
}
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 渲染用户名
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染用户头像,判断用户是否有头像
    if (user.user_pic !== null) {
        // 有头像时优先显示自己的头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }
    else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

