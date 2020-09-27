$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  // 验证用户名和密码
  // 调用layUI中的form方法
  var form = layui.form;
  // 调用layUI中的layer方法
  var layer = layui.layer;
  // 通过函数自定义校验规则
  form.verify ({
    // 验证用户名和密码是否规范
    pwd : [/^[\S]{6,12}$/,'密码必须为6到12位，且不能出现空格'],
    // 验证两次密码是否一致的规则
    repwd : function (value) {
      var pwd = $('.reg-box [name=password]').val();
      if(pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit',function (e) {
    e.preventDefault();
    $.post('/api/reguser',{username:$('#form_reg [name=username]')
    .val(),password :$('#form_reg [name=password]').val()},function(res) {
      if(res.status !== 0){
        return layer.msg(res.message);
      }
      layer.msg('注册成功,请登录');
      setTimeout(function () {
         $('#link_login').click();
      },1500)
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax( {
      type:'POST',
      url :'/api/login',
      data : $(this).serialize(),
      success :function (res) {
        if(res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功');
        localStorage.setItem('token',res.token);
        location.href = '/index.html';
      }
    })
  })
})