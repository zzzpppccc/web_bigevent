$(function () {
    var form = layui.form;
    form.verify( {
        nickname:function (value) {
            if(value.length > 6) {
                return '昵称长度不得超过6个字符'
            }
        }
    })
    initUserInfo();
    function initUserInfo () {
        $.ajax({
            type: 'GET',
            url :'/my/userinfo',
            success :function (res) {
                if(res.status !== 0) {
                    return layer.msg('获取信息失败');
                }
                console.log(res);
                form.val('formUserInfo',res.data)
            }
        })
    }
    $('#btnReset').on('click',function (e) {
        e.preventDefault();
        initUserInfo();
    })
    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e) {
        e.preventDefault();
        $.ajax( {
            type: 'POST',
            url : '/my/userinfo',
            data : $(this).serialize(),
            success :function (res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                window.parent.getUserInfo();
            }
        }) 
    })
}) 