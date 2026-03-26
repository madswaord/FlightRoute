# Host Integration Guide

FlightRoute 是一个宿主无关的流量去向可视化地图模块。

宿主只需要准备一个 adapter，把自己的数据能力注入给 FlightRoute 内核。

## 宿主最少需要提供什么

### 1. 起点 IP 能力
宿主需要告诉 FlightRoute：
- 当前出口 IP 是什么

### 2. Geo 查询能力
宿主需要告诉 FlightRoute：
- 给定一个 IP，如何拿到地理坐标

### 3. 连接数据能力
宿主需要告诉 FlightRoute：
- 当前有哪些连接
- 每条连接的目标 IP / host / 流量信息是什么

### 4. 可选：代理路径能力
如果宿主自己知道 proxy hop / final outbound name，可以额外注入：
- proxy hop geo
- final outbound name

## 推荐接入步骤
1. 宿主实现 `FlightRouteHostAdapter`
2. 宿主把原始连接数据映射成 `TrafficConnectionLike`
3. 宿主调用 FlightRoute 内核的 `resolveSvgTrafficRoutes()`
4. 宿主把结果交给自己的 UI 层渲染

## 可接入的宿主示例
- 网络面板
- 路由器设备
- 自定义流量采集器
- 桌面网络工具
- 其他 Web 管理界面

## 设计目标
FlightRoute 负责：
- 地图资产
- SVG 标定
- 流量建模
- 宿主边界定义

宿主负责：
- 提供数据
- 提供 Geo/IP 接入
- 决定如何渲染 UI 外壳
