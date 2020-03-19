/*蔬菜详情*/
var vm = new Vue({
    el:"#vegetableDetails",
    data:{
        vegetableInfo:"",
        vegetableTypeInfo:"",
    },

    mounted:function () {
        this.vegetableDetails();
    },

    methods:{

        //蔬菜详情
        vegetableDetails:function () {
            this.vegetableInfo=JSON.parse(window.sessionStorage.getItem("vegetableInfo"));
            this.selectByTypeId();
        },

        //蔬菜详情
        toVegetableDetails:function (data) {
            window.sessionStorage.setItem("vegetableInfo",JSON.stringify(data));
            window.location.href = "vegetable-details.html";
        },

        //查询同类蔬菜
        selectByTypeId:function () {
            $.ajax({
                url:"http://localhost:9000/vegetableOperation/selectByTypeId",
                type:"GET",
                dataType:"json",
                data: {"typeId":this.vegetableInfo.typeId},
                success:function (data) {
                    console.log(data);
                    if (data.code === 0 ){
                        vm.vegetableTypeInfo = data.TypeList
                    }
                }
            })
        }

    }

})