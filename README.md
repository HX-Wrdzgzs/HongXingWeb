# HongXingWeb

Hong Xing 技术 / 项目 / 服务官网。

## 当前设计

- 视觉基准：白色主页面、黑色文字、Hong Xing 原始红 `#FE2601`；深色仅用于 Quick Services 与页脚等强调区。
- Hong Xing 标志与字标均使用原始品牌图形重建 SVG。普通页面文字统一使用一套系统无衬线字体栈，不再混用多组展示字体。
- 首页以已确认效果图为结构基准：品牌首屏 → 项目入口 → 核心项目 → Quick Services → 最新公告 → 发展历程 → 苏州 / 南京迁移 → 生态项目 → 页脚。
- 首页红色 Logo 使用多层 SVG 构建立体厚度，并提供桌面指针透视；并非把静态 3D 效果图直接贴到页面。
- Quick Start / Quick Connect / Quick Route 三项全部常驻可见，不再依赖滚动触发才能看到正文。
- 首页取消“纵向滚动驱动横向 Slider”的交互，手机上下滑动不会再误触发左右切换。
- 苏州 / 南京迁移区改为城市地标识别模型：苏州采用东方之门意象，南京采用紫峰大厦与城市轮廓意象；这些视觉只用于城市识别，不代表实际机房建筑或部署地址。
- Amia_晓山瑞希素材保持彩色；首页不再把人物图作为独立大段主视觉，完整关联内容放在生态页。
- 更新公告支持关键词搜索、分类筛选、每页 5 条分页、URL 查询状态、详情弹窗与 hash 深链接。
- 子页面统一到与首页一致的白 / 黑 / 红编辑型视觉系统，并保留全屏菜单、滚动进入、项目章节导航、时间线与复制版本识别码等交互。
- 页面：`index`、`projects`、`infrastructure`、`updates`、`ecosystem`、`lifecycle`、`support`、`about`、`404`。
- 支持 `prefers-reduced-motion`。

## 内容原则

- HongXingOS、O3、AuthLit、HX Online2 分别展示，不以单一项目代表全部 Hong Xing。
- 不虚构用户量、SLA、全球节点、迁移百分比、下载地址或设备兼容清单。
- 公开文案优先依据时间更晚的正式公告；历史状态冲突时保留时间线，并用较新公告描述当前状态。
- 项目与生态名称只使用已经确认存在的仓库、服务和用户提供素材。
- 参考 NANFU 的页面节奏、留白、信息层级和交互方式，不复制其商标、产品图片或专有文案。

## Cloudflare Pages

纯静态站点，无构建步骤：

- Production branch: `main`
- Build command: 留空
- Build output directory: `/`
- Production domain: `hx.mizuki.top`

开发阶段 HTML / CSS / JS 采用重新验证缓存策略，减少 Cloudflare Pages 更新后仍显示旧资源的问题。
