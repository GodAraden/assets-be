# Araden 的静态资源服务器程序

技术栈：NestJS + TypeScript

已预置：Github Action Workflow

# 上传说明

上传时请求为 POST 格式，携带请求头 upload-assets-key，该请求头的组成为：

- .env.local 文件中的 key
- 当前日期的 toLocaleString 格式

上述组成部分拼接后经 md5 哈希得到
