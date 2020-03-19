/*菜谱详情*/
var vm = new Vue({
    el:"#menuDetails",
    data:{

        menu:{
            createTime:"",
        },

        steps:{

        },
        
        discussList:[],
        discussTotal:0, //评论条数
        pageSize:5,

        content:"",//评论内容

    },

    mounted:function () {
        this.menuDetails();
        this.stepSelect();
        this.selectDiscuss(this.pageSize);
    },

    methods:{

        //菜谱详情
        menuDetails:function () {
            var menu = JSON.parse(window.sessionStorage.getItem("mDetails"));
            this.menu = menu;
        },

        //步骤查询
        stepSelect:function () {
            $.ajax({
               url:"http://localhost:9000/menu/selectStepsByMId",
               type:"GET",
               dataType:"json",
               data: {"mId":this.menu.mid},
               success:function (data) {
                   if (data.code === 0){
                       //vm.steps = vm.removeNull(data.stepsData);
                       vm.steps = data.stepsData;
                   }else {
                       console.log(data.msg);
                   }

               }
            });
            
        },

        //删除对象中为 null 值的属性
        removeNull:function (obj) {
            if(!obj){
                return;
            }
            for(var item in obj){
                if(obj[item] === null || obj[item] === ''){
                    delete obj[item];
                }
            }
            return obj;
        },

        //查询菜谱评论
        selectDiscuss:function (pageSize) {
            $.ajax({
                url:"http://localhost:9000/menuOperation/selectDiscuss",
                type:"GET",
                dataType:"json",
                data:{
                    "menuId":this.menu.mid,
                    "pageSize":pageSize,
                    "currentPage":1
                },
                success:function (data) {
                    if (data.code === 0){
                        vm.discussList = data.dataList;
                        vm.discussTotal = data.total;
                    }else {
                        alert(data.msg);
                    }
                }
            });
        },

        //查看更多
        selectMore:function () {
            vm.pageSize = vm.pageSize + 5;
            vm.selectDiscuss(vm.pageSize);
        },

        //发表评论
        comment:function () {
            //获取用户 信息
            var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            var userId = userInfo.userId;
            var userName = userInfo.userName;
            var userHead = userInfo.userHead;
            $.ajax({
               url:"http://localhost:9000/menuOperation/insertDiscuss",
               type:"POST",
               dataType:"json",
               data:{
                   "userId":userId,
                   "userName":userName,
                   "userHead":userHead,
                   "menuId":vm.menu.mid,
                   "content":vm.content
               },
                success:function (data) {
                    if (data.code === 0){
                        vm.selectDiscuss(vm.pageSize);
                    }else {
                        alert(data.msg);
                    }
                }
            });
        }

        

    }

})