### 搭建项目

- 创建文件夹 `mkdir myapp`
- 搭建项目 `yarn create umi` - `app` - `N` - `antd,dva`

### 安装依赖

- 打开项目文件夹 `cd myapp`
- 安装依赖 `yarn`

### 启动项目
`yarn start`

### 更新layout布局
- 修改src/layouts 完成页面布局

### 约定式路由 vs 配置式路由
- 先采用配置式路由，在 .umirc.js 中配置路由

### 创建页面[默认创建在src目录下]
`umi g page user/index`
`umi g page index --typescript --less` --typescript,--less 约定初始化的模式，可以省略

### 创建导航条对应的空页面
- 根据创建页面的命令添加相应的pages，并配置好相应的路由
- 在 src/layouts/index 文件中将导航定位到相应的页面

### 创建登录页

### bug处理-登录表单
- umi创建的项目使用的antd为3.x版本，现在将antd升级到4.x版本
- 去官网，重新安装antd依赖
`yarn add antd --save`
- 会发现安装完antd4.x后，报错：Warning: [antd: Icon] Empty Icon.Icon不能正常使用
- 首先安装图标组件包 `yarn add @ant-design/icons  --save`
- 然后参考[官网](https://ant.design/components/icon-cn/)引入使用

### 前台端接口联调
- 代理配置 .umirc.js文件 - proxy
- 请求封装 umi-request
- 安装 `yarn add umi-request --save`
- umi-request 的二次封装： src/utils/request
- 统一接口管理： src/api
