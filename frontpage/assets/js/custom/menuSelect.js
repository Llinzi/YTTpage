/*菜谱查询*/
var vm = new Vue({
    el:"#menuInfo",
    data:{
        //查询内容
        params:{
            mName:"",
            pageSize:2,
            currentPage:1,
            pages:1,  //初始化总页数
        },
        total:0,
        dataList:[],
        dataDetails:{

        },
    },

    mounted:function () {
        var options = {
            bootstrapMajorVersion: 1,
            currentPage: this.params.currentPage, // 当前页数
            numberOfPages: 5, // 显示按钮的数量
            totalPages: this.params.pages, // 总页数
            onPageClicked:function(event, originalEvent, type,page){
                vm.params.currentPage=page;
                vm.menuSelect();
            },
            onPageChanged:function(event, oldPage, newPage){
                vm.params.currentPage=newPage;
                vm.menuSelect();
            }
        };
        $("#page").bootstrapPaginator(options);

        this.menuSelect();
    },

    methods:{
        //菜谱查询
        menuSelect:function(){
            $.ajax({
                url:"http://localhost:9000/menu/selectMenu",
                type:"GET",
                dataType:"json",
                data:this.params,
                success:function (data) {
                    console.log(data);
                    if (data.code === 0){
                        vm.dataList = data.dataList;
                        vm.params.pages = data.pages;//总页数
                        vm.params.currentPage = data.pageNum //第几页
                        vm.total = data.total; // 总条数this
                        $("#page").bootstrapPaginator('setOptions',{currentPage:vm.params.currentPage,totalPages:vm.params.pages});
                    }else {
                        alert(data.msg);
                    }
                }
            });
        },

        //点赞
        operation:function (id,type) {
            $.ajax({
                url: "http://localhost:9000/menuOperation/updateMenuNum",
                type:"POST",
                dataType: "json",
                data:{
                    "mId":id,
                    "type":type
                },
                success:function (data) {
                    if (data.code === 0){
                        vm.menuSelect();
                    }else {
                        alert(data.msg);
                    }
                }
            })
        },

        //添加收藏
        collection:function(mId){
            //获取用户 id
            var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            var userId = userInfo.userId;

            $.ajax({
                url:"http://localhost:9000/menuOperation/selectCollection",
                type:"GET",
                dataType:"json",
                data:{
                    "userId":userId,
                    "mId":mId
                },
                success:function (data) {
                    if (data.code === 0){
                        $.ajax({
                            url:"http://localhost:9000/menuOperation/insertCollection",
                            type:"POST",
                            dataType:"json",
                            data:{
                                "userId":userId,
                                "menuId":mId
                            },
                            success:function (data) {
                                if (data.code === 0){
                                    vm.menuSelect();
                                }else {
                                    alert(data.msg)
                                }
                            }
                        });
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

    }

})