/*
* 网页头部js
* */
var vm = new Vue({
    el:"#headerApp",
    data:{

        //登录用户的基本信息
        userInfo:{
        },

    },
    mounted:function () {
        this.initialize();
        /**
         * 设置用户信息表单验证
         */
        $("#userInfoForm").bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                userName:{
                    message:"名称验证失败",
                    validators: {
                        notEmpty: {
                            message:"名称不能为空"
                        },
                        stringLength:{
                            min:2,
                            max:6,
                            message:"名称长度为2到6个字符"
                        }

                    }
                },
                userSex:{
                    message:"性别验证失败",
                    validators: {
                        notEmpty: {
                            message:"请选择性别"
                        },
                    }
                },
                userAge:{
                    message:"年龄验证失败",
                    validators: {
                        notEmpty: {
                            message:"年龄不能为空"
                        },
                        numeric:{
                            message:"请填写数字"
                        }
                    }
                },
                userEmail:{
                    message:"邮箱验证失败",
                    validators: {
                        notEmpty: {
                            message:"邮箱不能为空"
                        },
                        emailAddress:{
                            message:"邮箱地址不正确"
                        }
                    }
                },


            }
        });


    },

    methods:{

        /**
         * 初始化用户信息
         */
        initialize:function(){
            //从缓存里获取用户信息
            this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            if (this.userInfo == null){
                alert("请先登录!");
                window.location.href = "login.html";
            }
        },

        //设置用户信息后保存
        saveUser:function(){
            //console.log(this.userInfo)
            //手动验证表单
            $("#userInfoForm").data("bootstrapValidator").validate();
            //获取表单验证状态
            var flag = $("#userInfoForm").data("bootstrapValidator").isValid();
            if (flag){
                $.ajax({
                    url:"http://localhost:9000/users/updateUser",
                    type:"POST",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(this.userInfo),
                    success:function (data) {
                        console.log(data);
                        if (data.code === 0){
                            //更新缓存
                            window.sessionStorage.setItem("userInfo",JSON.stringify(this.userInfo));
                            alert(data.msg);
                        }else {
                            alert(data.msg);
                        }
                    }
                });
            }
        },

        //修改头像
        updateUserHead:function () {
            var head = $("#userHead").val();
            if (head != ""){
                //1、删除图片
                var url = "http://localhost:9000/upload/deleteUserHead";
                var args = {
                    "userHead":this.userInfo.userHead
                }
                $.post(url,args,function (data){
                    if (data.code === 0){
                        $.ajax({
                            url:"http://localhost:9000/upload/userUpload",
                            type:"POST", //请求方式
                            dataType:"json", //前端发送数据的格式
                            cache:false, //关闭缓存
                            processData: false, //默认情况下，processData 的值是 true，其代表以对象的形式上传的数据都会被转换为字符串的形式上传。而当上传文件的时候，则不需要把其转换为字符串，因此要改成false
                            contentType: false, //上传文件时改为 false
                            data:new FormData($("#userForm")[0]), //用 Ajax 上传文件，需要使用 FormData 对象来作为数据
                            success:function (data){
                                if (data.code === 0){
                                    var userHead = "http://localhost:9000/img/users/" + data.fileName + data.extendedName;
                                    var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
                                    var userId = userInfo.userId;
                                    var params = {
                                        "userId":userId,
                                        "userHead": userHead
                                    }
                                    $.ajax({
                                        url:"http://localhost:9000/users/updateUser",
                                        type:"POST",
                                        //dataType:"json",
                                        contentType: "application/json",
                                        data: JSON.stringify(params),
                                        success:function (data) {
                                            if (data.code === 0){
                                                userInfo.userHead = userHead;
                                                window.sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
                                                alert(data.msg);
                                            }else {
                                                alert(data.msg);
                                            }
                                        }
                                    });
                                }else {
                                    alert(data.msg);
                                }
                            }
                        });
                    }else {
                        alert(data.msg)
                    }
                });
            }else {
                alert("请选择新的头像!");
            }
        }



    }
})


