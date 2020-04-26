/*我的菜谱*/
var vm = new Vue({
    el:"#menuCollection",
    data:{
        params:{
            userId:null,
            pageSize:5,
            currentPage:1,
            pages:1,
        },
        total:1,
        dataList:[],
    },

    mounted:function () {
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: this.params.currentPage, // 当前页数
            numberOfPages: 5, // 显示按钮的数量
            totalPages: this.params.pages, // 总页数
            onPageClicked:function(event, originalEvent, type,page){
                vm.params.currentPage=page;
                vm.menuCollectioon();
            },
            onPageChanged:function(event, oldPage, newPage){
                vm.params.currentPage=newPage;
                vm.menuCollectioon();
            }
        };
        $("#page").bootstrapPaginator(options);

        this.myMenu();
    },

    methods:{
        //我的菜谱
        myMenu:function () {
            var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            this.params.userId = userInfo.userId;
            $.ajax({
               url:"http://localhost:9000/menu/selectMenu",
               type:"GET",
               dataType:"json",
               data:this.params,
               success:function (data) {
                   if (data.code === 0){
                       vm.dataList = data.dataList;
                       vm.params.pages = data.pages;//总页数
                       vm.params.currentPage = data.pageNum //第几页
                       vm.total = data.total; // 总条数
                       $("#page").bootstrapPaginator('setOptions',{currentPage:vm.params.currentPage,totalPages:vm.params.pages});
                   }else {
                       alert(data.msg);
                   }
               }
            });
        },

        //菜谱详情
        menuDetails:function (data) {
            window.sessionStorage.setItem("mDetails",JSON.stringify(data));
            window.location.href = "menu-details.html";
        },
        
        //删除菜谱（其实没有删除，只是把用户id修改为管理员id）
        deleteMenu:function (mid) {
            if (confirm("确定要删除吗？")){
                $.ajax({
                    url:"http://localhost:9000/menu/updateMenu",
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json",
                    data:JSON.stringify({
                        "mid":mid,
                        "userId":2
                    }),
                    success:function (data) {
                        if (data.code === 0){
                            //alert(data.msg);
                            vm.myMenu();
                        }else {
                            alert(data.msg);
                        }
                    }
                });
            }
        }

    }

})