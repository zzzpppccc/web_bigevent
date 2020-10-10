$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    console.log(6666);

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();
    // 定义获取文章信息的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章信息失败')
                }
                // layer.msg('获取成功')
                console.log(9999);
                // 将模板引擎中的数据渲染到表格中
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(55555);
                // 分类数据加载完成后渲染分页
                renderPage(res.total);
            }
        })
    }
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 自定义分页功能项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 定义每页展示几条数据
            // 点击分页切换时，调用jump回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                // 将最新的页码值，赋值给q查询对象中
                q.pagenum = obj.curr;
                // 切换每页信息条数时将其赋值给pagesize
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }
    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 获得要删除的文章id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax( {
                method: 'GET',
                url: '/my/article/delete/' + id,
                success : function (res) {
                    if (res.status !== 0 ) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 当len的值等于1时证明当前页面没有数据,之后再调用initTable函数
                    // len的值最小为1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})