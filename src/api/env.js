/*
 * @Description: 后台地址配置文件
 */
module.exports = {
  development: {
    // apiUrl: 'http://192.168.212.26:9527',
    apiUrl: "http://192.168.212.13:8010/api",
    socketUrl: ""
  },
  debug: {
    // apiUrl: 'http://192.168.212.26:9527',
    apiUrl: "http://192.168.212.13:8010/api",
    socketUrl: ""
  },
  test: {
    apiUrl: "http://192.168.212.63:8010/api",
    socketUrl: ""
  },
  production: {
    apiUrl: "",
    socketUrl: ""
  }
};
