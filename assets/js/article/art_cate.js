$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '280px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 通过代理的方式，为form-add绑定submit事件（因为form-add是模板引擎中的内容）
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    // 通过代理的方式，为btn-edit绑定click事件（因为btn-edit是模板引擎中的内容）
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function (e) {
        // 为编辑按钮定义弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '280px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })
        // 点击编辑后弹出层中获取该条信息
        var id = $(this).attr('data-id');
        //console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    //通过代理的方式，为from-edit绑定submit事件（因为from-edit是模板引擎中的内容）
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {       
                if (res.status !== 0) {
                    return layer.msg('更新信息失败');
                }
                layer.msg('更新信息成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    // 通过代理的方式，绑定删除事件
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax( {
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                  if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                  }
                  layer.msg('删除分类成功！');
                  layer.close(index);
                  initArtCateList();
                }
            })
        })
    })
})