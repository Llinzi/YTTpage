/*菜谱详情*/
var vm = new Vue({
    el:"#menuAdd",
    data:{
      params:{
          menuEntity:{
              image:'',
              userId:null,
          },
          stepsEntity:{
          }
      }
    },

    mounted:function () {
        //菜谱表单验证
        $("#menuForm").bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },

            fields:{
                menuPhoto:{
                    message: "图片验证失败",
                    validators:{
                        notEmpty:{
                            message:"请选择菜谱图片"
                        }
                    }
                },

                mname:{
                    message: "菜谱名称验证失败",
                    validators:{
                        notEmpty:{
                            message:"请输入菜谱名称"
                        }
                    }
                },

                level:{
                    message: "菜谱难度验证失败",
                    validators:{
                        notEmpty:{
                            message:"请选择菜谱难度"
                        }
                    }
                },

                time:{
                    message: "烹饪时间验证失败",
                    validators:{
                        notEmpty:{
                            message:"请输入烹饪时间"
                        }
                    }
                },

                foodMaterial:{
                    message: "所需食材验证失败",
                    validators:{
                        notEmpty:{
                            message:"请输入所需食材"
                        }
                    }
                },

                step1:{
                    message: "步骤验证失败",
                    validators:{
                        notEmpty:{
                            message:"请输入步骤一"
                        }
                    }
                },

                step2:{
                    message: "步骤验证失败",
                    validators:{
                        notEmpty:{
                            message:"请输入步骤二"
                        }
                    }
                },


            }

        });
    },

    methods:{

        //菜谱添加
        pushMenu:function () {
            //手动验证表单
            $("#menuForm").data("bootstrapValidator").validate();
            //获取表单验证状态
            var flag = $("#menuForm").data("bootstrapValidator").isValid();
            if (flag){
                //上传菜谱图片
                $.ajax({
                    url:"http://localhost:9000/upload/menuUpload",
                    type:"POST", //请求方式
                    dataType:"json", //前端发送数据的格式
                    cache:false, //关闭缓存
                    processData: false, //默认情况下，processData 的值是 true，其代表以对象的形式上传的数据都会被转换为字符串的形式上传。而当上传文件的时候，则不需要把其转换为字符串，因此要改成false
                    contentType: false, //上传文件时改为 false
                    data:new FormData($("#menuForm")[0]),
                    success:function (data) {
                        if (data.code === 0){
                            vm.params.menuEntity.image = "http://localhost:9000/img/menu/" + data.fileName + data.extendedName;
                            var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
                            vm.params.menuEntity.userId = userInfo.userId;
                            //1、添加步骤
                            $.ajax({
                                url:"http://localhost:9000/menu/insertMenu",
                                type:"POST",
                                contentType:"application/json",
                                data:JSON.stringify(vm.params),
                                success:function (data) {
                                    if (data.code === 0){
                                        alert(data.msg);
                                    }else {
                                        alert(data.msg);
                                    }
                                }
                            });
                        }else {

                        }
                    }
                });

            }
        },

    }

})