# HongXingWeb

Hong Xing 技术 / 项目 / 服务官网。

## 设计原则

- 仅使用黑、白、红作为站点 UI 主色。
- 首页不把 HongXingOS 作为唯一主导项目。
- 公开文案优先依据最新公告；历史状态冲突按时间顺序标注。
- 不使用虚构用户量、SLA、全球节点、迁移百分比等未经确认的数据。
- 当前图片素材仅包含 Hong Xing 立体标志与用户提供的 Amia_晓山瑞希项目形象。

## 页面

- `index.html` 首页
- `projects.html` 项目与服务
- `infrastructure.html` 基础设施
- `updates.html` 更新公告（筛选 / 搜索 / 分页 / 详情弹窗）
- `ecosystem.html` 生态关联
- `lifecycle.html` 生命周期
- `support.html` 支持与下载
- `about.html` 关于

## 动画与交互

- 首屏 3D Logo 入场、视差与指针倾斜
- GSAP + ScrollTrigger 滚动增强（CDN 不可用时有 IntersectionObserver 回退）
- 页面切换淡出 / 淡入
- 滚动进度条
- 主题切换（黑 / 白）
- 移动端全屏菜单
- 公告筛选、搜索、分页、详情弹窗
- 生命周期滚动进度动画
- 基础设施迁移状态动效

## Cloudflare Pages

这是纯静态站点，无构建步骤。

- Build command：留空
- Build output directory：`/`
- Production branch：`main`
