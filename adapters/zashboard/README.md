# zashboard adapter

这里记录 FlightRoute 如何挂回 zashboard。

## 当前高耦合点
- `src/components/overview/WorldTrafficMapCard.vue`
- `src/views/OverviewPage.vue`
- `src/store/settings.ts`
- `src/i18n/*.ts`

## 当前低耦合点
- `src/assets/maps/world-atlantic.svg`
- `src/composables/svgCalibration.ts`
- `src/composables/svgTrafficModel.ts`

## 后续目标
让 zashboard 中只保留：
- 一个薄卡片组件
- 一个 Overview 挂点
- 少量设置 / 文案接线

其余逻辑尽量下沉到 FlightRoute 自己维护。
