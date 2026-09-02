# HongXingWeb

Hong Xing 技术 / 项目 / 服务官网。

## 当前实现

- 黑、白、红三色 UI；Amia_晓山瑞希项目形象保留原彩色素材。
- 导航与 favicon 使用依据用户提供标志重建的 Hong Xing SVG，不再使用 CSS 伪造图标。
- 首页标志不是平面“3D 效果图”：由同一 SVG 轮廓生成多层矢量结构，支持透视、指针倾斜与滚动联动。
- 首页采用长滚动叙事：项目主线、O3 Quick Services、更新滑轨、基础设施迁移、Amia 关联与生命周期。
- 完整页面：项目与服务、基础设施、更新公告、生态关联、生命周期、支持与下载、关于、404。
- 更新公告支持搜索、分类筛选、分页、URL 查询状态、详情弹窗与 hash 深链接。
- 移动端菜单、黑白主题、滚动进度、IntersectionObserver / GSAP 动画增强和 `prefers-reduced-motion` 降级。

## 内容原则

- 不把 HongXingOS 作为 Hong Xing 的唯一主导内容。
- 不虚构用户量、SLA、全球节点、迁移百分比、下载地址或设备兼容清单。
- 公开文案优先依据时间更晚的正式公告；历史状态冲突时保留时间线并说明后续变化。
- 项目图片只使用用户确认或公开确认的素材。

## Cloudflare Pages

纯静态站点，无构建步骤：

- Production branch: `main`
- Build command: 留空
- Build output directory: `/`
