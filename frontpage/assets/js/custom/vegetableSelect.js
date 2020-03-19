/*蔬菜查询*/
var vm = new Vue({
    el:"#vegetableInfo",
    data:{
        //查询内容
        params:{
            vName:"",
            typeId:"",
            vNickname:"",
            pageSize:8,
            currentPage:1,
            pages:1,  //初始化总页数
        },
        dataList:[],
        typeList:[],
    },

    mounted:function () {
        var options = {
            bootstrapMajorVersion: 1,
            currentPage: this.params.currentPage, // 当前页数
            numberOfPages: 5, // 显示按钮的数量
            totalPages: this.params.pages, // 总页数
            onPageClicked:function(event, originalEvent, type,page){
                vm.params.currentPage=page;
                vm.vegetableSelect();
            },
            onPageChanged:function(event, oldPage, newPage){
                vm.params.currentPage=newPage;
                vm.vegetableSelect();
            }
        };
        $("#page").bootstrapPaginator(options);

        this.vegetableSelect();
        this.selectType();
    },

    methods:{
        //蔬菜查询
        vegetableSelect:function(){
            $.ajax({
                url:"http://localhost:9000/vegetableInfo/selectVegetable",
                type:"GET",
                dataType:"json",
                //async:false,
                data: this.params,
                success:function (data) {
                    if (data.code === 0){
                        vm.dataList = data.dataList;//查询到的数据
                        vm.params.pages = data.pages;//总页数
                        vm.params.currentPage = data.pageNum //第几页
                        //设置分页(当前页,总页数)
                        $("#page").bootstrapPaginator('setOptions',{currentPage:vm.params.currentPage,totalPages:vm.params.pages});
                    }else {
                        alert(data.msg);
                    }
                }
            });
        },

        //查询类别
        selectType:function () {
            $.ajax({
                url:"http://localhost:9000/vegetableInfo/selectType",
                type:"GET",
                dataType:"json",
                //async:false,
                success:function (data) {
                    if (data.code === 0){
                        vm.typeList = data.typeList;
                    }else {
                        alert(data.msg);
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