# zashboard upstream 跟随策略

## 目标
在尽量不破坏 Atlantic SVG 地图结构的前提下，持续跟随 zashboard upstream 更新。

## 当前判断
最容易与 upstream 发生冲突的文件：
- `src/components/overview/WorldTrafficMapCard.vue`
- `src/views/OverviewPage.vue`
- `src/store/settings.ts`
- `src/i18n/*.ts`
- `src/router/index.ts`

相对安全、适合长期独立维护的部分：
- `src/assets/maps/world-atlantic.svg`
- `src/composables/svgCalibration.ts`
- `src/composables/svgTrafficModel.ts`
- `src/api/geoip-map.ts`
- `src/api/public-ip.ts`
- `src/helper/proxyRouteResolver.ts`
- `map-assets/` 下的资产与文档

## 建议拆分方式
1. 资产层独立
   - SVG
   - 标定数据
   - 生成脚本
   - 文档
2. 渲染层独立
   - `svgCalibration.ts`
   - `svgTrafficModel.ts`
3. 适配层变薄
   - zashboard 只保留卡片组件和少量 overview 接线

## 推荐后续动作
- 把 `svgCalibration.ts` / `svgTrafficModel.ts` 逐步迁入 `flightroute/render/`
- 把地图资产与说明迁入 `flightroute/assets/` 和 `flightroute/docs/`
- zashboard 中只保留最薄的一层接线
- 每次跟 upstream 更新后，优先人工复核 Overview / settings / i18n / router 四类文件
