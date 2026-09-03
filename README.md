# HongXingWeb

Hong Xing 技术 / 项目 / 服务官网。

## 当前实现

- 黑、白、红三色 UI；Amia_晓山瑞希项目形象保持彩色显示。
- 导航与 favicon 使用依据原始标志重建的 Hong Xing SVG。
- 首页标志使用多层 SVG 构建立体厚度，支持透视、指针倾斜与滚动联动，不使用平面 3D 效果图冒充实时模型。
- 首页采用长滚动叙事：品牌首屏、三项维护原则、项目滑轨、O3 Quick Services 滚动舞台、近期动态、苏州 → 南京迁移、Amia 关联与生命周期。
- 手机端横向内容改用原生横向滚动与 Scroll Snap；上下滑动不再由脚本接管，避免纵向手势误触发横向切换。
- 苏州 / 南京迁移区恢复建筑模型，并在独立基础设施页面提供更完整的双城迁移场景。
- 子页面统一使用新的大标题、黑白红视觉、全屏菜单、直角信息区块与时间线样式。
- 完整页面：项目与服务、基础设施、更新公告、生态关联、生命周期、支持与下载、关于、404。
- 更新公告支持搜索、分类筛选、分页、URL 查询状态、详情弹窗与 hash 深链接。
- 移动端菜单、黑白主题、滚动进度、IntersectionObserver / GSAP 动画增强和 `prefers-reduced-motion` 降级。

## 内容原则

- HongXingOS、O3、AuthLit、HX Online2 分别展示，不以单一项目代表全部 Hong Xing。
- 不虚构用户量、SLA、全球节点、迁移百分比、下载地址或设备兼容清单。
- 公开文案优先依据时间更晚的正式公告；历史状态冲突时保留时间线并说明后续变化。
- 项目图片只使用已确认素材。

## Cloudflare Pages

纯静态站点，无构建步骤：

- Production branch: `main`
- Build command: 留空
- Build output directory: `/`
