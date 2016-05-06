var config = {
    version:"0.1",
    serviceUrl:"",          // 服務接口位址
    ossUrl:"",              // oss 服务接口位址
    userUrl:"",             // user 服务接口位址
    rootUrl:"",             // 網站位址
    uploadTokenUrl:"",      // 上传接口 - 生成token信息
    uploadFlashUrl:"",      // 上传接口 - flash上传
    uploadUrl:"",           // 上传接口
    viewPath:"",            // view 路径
    controllerPath:"",      // controller 路径
    refererPage:"",         // 上一页网址 
    currentPage:""          // 目前页面网址
};

var __VERSION__ = "0.1";

var __HOST__ = window.location.host;                // 網站 HOST
var __PROTOCAL__ = window.location.protocol;        // 網站 PROTOCAL

var __UPLOAD_TOKEN_URL__ = "";                      // 上传接口 - 生成token信息
var __UPLOAD_FLASH_URL__ = "";                      // 上传接口 - flash上传
var __UPLOAD_URL__ = "";                            // 上传接口

if(__HOST__ == "123.127.244.236:8080") {       // 测试机
    config.rootUrl = "http://123.127.244.236:8080/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.userUrl = "http://172.31.10.168/";
    config.ossUrl = "http://172.31.10.168:19791/config/oss/api";
    config.viewPath = "/views/";
    config.controllerPath = "/engine/controllers/";
}else if(__HOST__ == "outside-test-Frontend") {       // 测试机
    config.rootUrl = "http://outside-test-Frontend/";
    config.serviceUrl = "http://outside-test-b2c/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.userUrl = "http://outside-test-user/";
    config.ossConfigUrl = "http://outside-test-oss-config/oss/config/api";
    config.ossNotifyUrl = "http://outside-test-oss-notify/oss/notify/api";
    config.ossLogUrl = "http://outside-test-oss-log/oss/log/api";
    config.ossUploadUrl = "http://outside-test-oss-upload/oss/upload/api";
    config.viewPath = "/views/";
    config.controllerPath = "/engine/controllers/";
}else if(__HOST__ == "172.31.10.53") {    // 开发机
    config.rootUrl = "http://172.31.10.53/zhl/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.userUrl = "http://172.31.10.168/";
    config.ossConfigUrl = "http://172.31.10.168:19790/oss/config/api";
    config.ossNotifyUrl = "http://172.31.10.168:19890/oss/notify/api";
    config.ossLogUrl = "http://172.31.10.168:19990/oss/log/api";
    config.ossUploadUrl = "http://172.31.10.168:20000/oss/upload/api";
    config.viewPath = "/zhl/views/";
    config.controllerPath = "/zhl/engine/controllers/";
} else {
    //__VERSION__ = Math.random();
    config.rootUrl = "http://localhost/zhl/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.userUrl = "http://172.31.10.168/";
    config.ossConfigUrl = "http://172.31.10.168:19790/oss/config/api";
    config.ossNotifyUrl = "http://172.31.10.168:19890/oss/notify/api";
    config.ossLogUrl = "http://172.31.10.168:19990/oss/log/api";
    config.ossUploadUrl = "http://172.31.10.168:20000/oss/upload/api";
    config.viewPath = "/zhl/views/";
    config.controllerPath = "/zhl/engine/controllers/";
}
