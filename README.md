# 企业微信机器人消息

> 企业微信推送 gitLab 代码仓库 push | MR | tag push 操作消息

## 使用

* 默认端口 8001 （app.js内可修改)
  
* 启动服务 
  
  > node app.js 或
  > 
  > npm serve 或
  > 
  > pm2 start app.js --name wxHook
  
* gitLab仓库配置
  > 路径 Settings - Integrations
  >
  > + URL 输入框 填写服务地址 path 内容为 企业微信机器人key（串号 0cd7ebfe-a977-....)
  > 
  >  如：http://127.0.0.1:8001/key
  > 
  >  也可以（无偿）使用个人已有服务 https://api.xpfei.cn/wxHook/key
  > 
  > + 勾选 Push events、 Merger request events、Tag push events(仅支持常用3个)
  >
  > + 点击 Add webhook 按钮
