# Core Status

## 已迁入 FlightRoute 的内核
- `render/svgCalibration.ts`
- `render/svgTrafficCore.ts`

## 当前状态说明
### svgCalibration.ts
已经基本独立，可直接视为 FlightRoute 核心标定逻辑。

### svgTrafficCore.ts
这是从 zashboard 版本中抽象出来的宿主无关核心：
- 不直接依赖 zashboard store
- 不直接依赖 zashboard API
- 通过 `FlightRouteHostAdapter` 获取宿主输入

## 当前仍留在 zashboard 的部分
- zashboard 实际 adapter 实现
- 当前正式卡片组件接线
- 当前 IP / geo / proxy hop 的具体调用方式
