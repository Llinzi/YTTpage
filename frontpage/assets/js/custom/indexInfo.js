/*菜谱详情*/
var vm = new Vue({
    el:"#indexInfo",
    data:{
        LikeumList:[],
        randList:[],
    },

    mounted:function () {
        this.menuLikeNum();
        this.selectRand();
    },

    methods:{

        //菜谱推荐
        menuLikeNum:function () {
            $.ajax({
                url:"http://localhost:9000/menuOperation/selectLikeum",
                type:"GET",
                dataType:"json",
                success:function (data) {
                    if (data.code === 0){
                        vm.LikeumList = data.LikeumList;
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
                        vm.menuLikeNum();
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

        //蔬菜推荐
        selectRand:function () {
            $.ajax({
                url:"http://localhost:9000/vegetableOperation/selectRand",
                type:"GET",
                dataType:"json",
                success:function (data) {
                    if (data.code === 0){
                        vm.randList = data.randList;
                    }
                }
            });
        },

        //蔬菜详情
        toVegetableDetails:function (data) {
            window.sessionStorage.setItem("vegetableInfo",JSON.stringify(data));
            window.location.href = "vegetable-details.html";
        }

    }

})