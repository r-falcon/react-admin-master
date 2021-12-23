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
