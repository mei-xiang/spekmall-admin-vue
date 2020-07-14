/*
 * @Description: 后台地址配置文件
 */
module.exports = {
  development: {
    apiUrl: "http://192.168.212.13:8010",
    socketUrl: "http://192.168.212.13:9099"
  },
  debug: {
    apiUrl: "http://192.168.212.13:8010",
    socketUrl: "http://192.168.212.13:9099"
  },
  test: {
    apiUrl: "http://192.168.212.63:8010",
    socketUrl: "http://192.168.212.63:9099"
  },
  production: {
    apiUrl: "",
    socketUrl: ""
  }
};
