# zashboard Adapter Draft

## 目标
把 zashboard 当前能力包装成 FlightRoute 需要的 `FlightRouteHostAdapter`，而不是让 FlightRoute 直接依赖 zashboard。

---

## FlightRoute 侧期望的接口

```ts
interface FlightRouteHostAdapter {
  getEgressIp(): Promise<string | null>
  fetchGeoPoint(ip: string): Promise<GeoPoint | null>
  listConnections(limit: number): Promise<TrafficConnectionLike[]>
  resolveProxyHopGeoPoint?(connection: TrafficConnectionLike): Promise<GeoPoint | null>
  getFinalOutboundName?(connection: TrafficConnectionLike): string | null
}
```

---

## zashboard 当前对应能力

### 1. getEgressIp()
当前来源：
- `getIPFromIpipnetAPI()`

包装方式：
```ts
const getEgressIp = async () => {
  const ipip = await getIPFromIpipnetAPI()
  return ipip?.data?.ip ?? null
}
```

说明：
- 目前这是唯一明确允许暂借 zashboard 的宿主能力
- 后续 FlightRoute 可以自己提供默认实现或可插拔 provider

---

### 2. fetchGeoPoint(ip)
当前来源：
- `fetchGeoPoint()` from `src/api/geoip-map.ts`

包装方式：
```ts
const fetchGeoPointForFlightRoute = async (ip: string) => {
  return await fetchGeoPoint(ip)
}
```

说明：
- 当前仍由 zashboard 提供 geo 查询接入
- FlightRoute 未来可把 provider 层也独立出去

---

### 3. listConnections(limit)
当前来源：
- `activeConnections.value`

FlightRoute 需要的是宿主无关结构：
```ts
interface TrafficConnectionLike {
  id: string
  host: string
  destinationIP: string
  download: number
  upload: number
  raw: unknown
}
```

zashboard 包装示意：
```ts
const listConnections = async (limit: number): Promise<TrafficConnectionLike[]> => {
  return activeConnections.value.slice(0, limit).map((conn) => ({
    id: conn.id,
    host: conn.metadata.host || conn.metadata.sniffHost || conn.metadata.destinationIP,
    destinationIP: conn.metadata.destinationIP,
    download: conn.download,
    upload: conn.upload,
    raw: conn,
  }))
}
```

说明：
- `raw` 字段只是为了宿主内部继续做 proxy hop/outbound name 解析
- FlightRoute 内核本身不应该依赖 `raw` 的具体结构

---

### 4. resolveProxyHopGeoPoint(connection)
当前来源：
- `resolveProxyHopGeoPoint()` from `src/helper/proxyRouteResolver.ts`

包装示意：
```ts
const resolveProxyHopGeoPointForFlightRoute = async (connection: TrafficConnectionLike) => {
  return await resolveProxyHopGeoPoint(connection.raw as Connection)
}
```

说明：
- 这是典型宿主耦合点
- 因为它依赖 zashboard 原始连接结构
- 后续如果 FlightRoute 要彻底独立，需要抽象 proxy hop 解析输入格式

---

### 5. getFinalOutboundName(connection)
当前来源：
- `getFinalOutboundName()` from `src/helper/proxyRouteResolver.ts`

包装示意：
```ts
const getFinalOutboundNameForFlightRoute = (connection: TrafficConnectionLike) => {
  return getFinalOutboundName(connection.raw as Connection)
}
```

说明：
- 也属于宿主耦合点
- 当前可由 zashboard adapter 注入

---

## zashboard adapter 组合示意

```ts
const zashboardFlightRouteAdapter: FlightRouteHostAdapter = {
  getEgressIp,
  fetchGeoPoint: fetchGeoPointForFlightRoute,
  listConnections,
  resolveProxyHopGeoPoint: resolveProxyHopGeoPointForFlightRoute,
  getFinalOutboundName: getFinalOutboundNameForFlightRoute,
}
```

---

## 后续演进建议

### 第一阶段
- 保持当前 adapter 注入方式
- 让 FlightRoute 内核先独立

### 第二阶段
- 把 geo provider 抽出 FlightRoute 自己管理
- 把 proxy hop 解析输入规范化

### 第三阶段
- 让 zashboard 只负责提供原始连接数据和宿主环境
- FlightRoute 负责完整渲染内核与大部分数据处理
