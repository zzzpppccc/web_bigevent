$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor()
  // 定义文章分类下拉框的数据获取函数
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        var htmlStr = template('tpl-cate', res);
        $('[name= cate_id]').html(htmlStr);
        form.render();
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 为选择封面函数绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click();
  })
  // 监听隐藏的overFile的change事件，获取用户的
  $('#coverFile').on('change', function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return layer.msg('请选择图片');
    }
    // 根据文件创建对应的URL地址
    var newImgURL = URL.createObjectURL(files[0]);
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  // 定义文章发布状态的变量
  var art_state = '已发布';
  // 当点击存为草稿时，将文章状态改为‘草稿’
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  })
  // 为表单监听提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 基于form表单，快速创建一个FormData对象
    var fd = new FormData($(this)[0]);
    // 为对象添加state属性
    fd.append('state', art_state);
    // 将用户选择的封面图片转化为文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 发起 ajax 数据请求
        publishArticle(fd);
      })
  })
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '../article/art_list.html'
      }
    })
  }
})
