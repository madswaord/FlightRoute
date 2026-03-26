# Host Boundary: zashboard -> FlightRoute

## 设计原则
FlightRoute 是独立项目，zashboard 只是其中一个宿主适配器。

## 当前唯一允许的宿主借用点
目前仅“起点公网 IP 获取能力”暂借用 zashboard 的已有实现。

## 当前 zashboard 还掌握的输入
- 当前活跃连接列表
- destinationIP / host 等连接元数据
- proxy hop 解析能力
- final outbound name 解析能力
- geo 查询 API 接入

## 适配目标
zashboard 最终应只向 FlightRoute 注入一个 host adapter：
- `getEgressIp()`
- `fetchGeoPoint(ip)`
- `listConnections(limit)`
- `resolveProxyHopGeoPoint(connection)`
- `getFinalOutboundName(connection)`

FlightRoute 内核不直接 import zashboard store / api / helper。
