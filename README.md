# HongXingWeb

Hong Xing 技术 / 项目 / 服务官网。

## 设计与实现

- 主视觉使用黑、白与原始红 `#FE2601`；Amia_晓山瑞希项目形象保持彩色。
- Hong Xing 标志与字标均使用从原始品牌图形重建的 SVG，高 DPI / 4K 下保持矢量清晰度。
- 首页 Logo 由多层 SVG 构建立体厚度，支持透视、桌面指针倾斜与滚动视差，不使用静态 3D 效果图代替交互模型。
- 首页按单一叙事顺序组织：品牌首屏 → 三个当前工作方向 → 项目与服务 → O3 / Quick Services → 近期动态 → 苏州至南京迁移 → Amia 关联 → 状态时间线。
- 首页运行时只使用 `site.js + home.js` 与 `site.css + home.css`，旧版首页样式与运行脚本已移除，避免多套滚动控制器互相覆盖。
- 项目区桌面端支持按钮与方向锁定拖动；移动端直接纵向浏览，不用纵向手势驱动横向位移。
- Quick Start / Quick Connect / Quick Route 的正文始终存在并可读；桌面端滚动只改变左侧 O3 模型当前焦点，移动端不使用 sticky 隐藏。
- 苏州 / 南京迁移使用 CSS / DOM 建筑模型与滚动进度；独立基础设施页保留更完整的迁移场景。
- 更新公告支持关键词搜索、分类筛选、每页 5 条分页、URL 查询状态、详情弹窗与 hash 深链接。
- 子页面统一使用大字号、黑白红视觉、全屏菜单、直角信息区块、页面过渡、时间线与滚动进入动画。
- 页面：`index`、`projects`、`infrastructure`、`updates`、`ecosystem`、`lifecycle`、`support`、`about`、`404`。
- 支持 `prefers-reduced-motion`，降低动画需求时取消或弱化强运动效果。

## 内容原则

- HongXingOS、O3、AuthLit、HX Online2 分别展示，不以单一项目代表全部 Hong Xing。
- 不虚构用户量、SLA、全球节点、迁移百分比、下载地址或设备兼容清单。
- 公开文案优先依据时间更晚的正式公告；历史状态冲突时保留时间线，并用较新公告描述当前状态。
- 项目图片只使用已确认素材。
- 参考 NANFU 的页面节奏、信息层级与交互方法，不复制其商标、产品图片、专有文案或其他品牌资产。

## Cloudflare Pages

纯静态站点，无构建步骤：

- Production branch: `main`
- Build command: 留空
- Build output directory: `/`
- Production domain: `hx.mizuki.top`
