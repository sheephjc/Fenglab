# Feng Lab Website

Feng Lab 课题组官网初版，采用 React + Vite + TypeScript 构建。站点是纯静态产物，可先部署到 Vercel，后续也可以把 `dist` 目录上传到腾讯云、阿里云或学校服务器。

## 本地运行

```powershell
npm.cmd install
npm.cmd run dev
```

## 构建

```powershell
npm.cmd run build
```

构建完成后，静态文件会生成到 `dist` 目录。

## 更新内容

主要内容集中在 `src/data/siteData.ts`：

- `siteInfo`：站点名称、单位、邮箱、地址、联系方式
- `heroSlides`：首页大图轮播
- `researchDirections`：研究方向
- `publications`：代表论文和完整论文列表
- `memberSections`：教师、现有学生、以往学生
- `galleryItems`：课题组风采
- `newsItems`：首页动态

图片放在 `public/images`。替换真实合照、论文成果图或成员头像时，保持文件路径或同步修改数据文件里的 `image` 字段即可。
