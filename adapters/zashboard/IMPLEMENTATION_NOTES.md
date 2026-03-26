# Implementation Notes

## 当前建议
真正落代码时，不建议先反向改 zashboard 为 import `/root/flightroute` 的本地文件路径。

更稳妥的步骤：
1. 先把 FlightRoute 目录整理完整
2. 明确 adapter 接口
3. 再决定：
   - 作为 workspace package 引入
   - 作为 git submodule / subtree
   - 作为独立 npm 包 / 私有包引入

## 为什么先写 adapter 草稿
因为当前最重要的是边界清晰：
- FlightRoute 不依赖 zashboard
- zashboard 通过 adapter 注入能力

一旦接口稳定，后面换宿主也更容易。
