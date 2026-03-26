# FlightRoute 架构分层

## 1. 核心资产层（assets/）
放独立于宿主项目的地图资产与生成材料：
- `assets/maps/world-atlantic.svg`
- `assets/generated/*`
- `assets/sources/*`
- `assets/build_atlantic_world.py`

这部分应尽量保持宿主无关，方便未来独立仓库复用。

## 2. 渲染内核层（render/）
后续承载：
- SVG 标定逻辑
- 经纬度到 SVG 坐标映射
- 流量点线建模
- 点位/飞线视觉参数策略

建议后续从 zashboard 迁入：
- `svgCalibration.ts`
- `svgTrafficModel.ts`

## 3. 适配层（adapters/zashboard/）
宿主接线层，专门放和 zashboard 相关的耦合说明：
- 正式卡片组件如何接 `render/`
- 数据从 zashboard store 如何注入
- i18n / Overview / settings 接线点有哪些

## 4. 文档层（docs/）
放状态、策略、设计说明：
- 当前状态
- upstream 跟随策略
- 架构说明

## 5. 备注层（notes/）
放临时拆分清单、迁移草稿、后续待办。
