# Feng-lab@Buct Website

Feng-lab@Buct 课题组官网初版，采用 React + Vite + TypeScript 构建。站点是纯静态产物，可先部署到 Vercel，后续也可以把 `dist` 目录上传到腾讯云、阿里云或学校服务器。

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

主要内容改 `src/data/csv` 里的表格，页面会通过 `src/data/siteData.ts` 统一读取：

- `home.csv`：首页轮播图、首页新闻；轮播图的 `caption_zh`、`caption_en` 为图片下方图注，`image_fit` 可写 `cover` 或 `contain` 控制裁切方式，`caption_bilingual=yes` 时按英文、中文两行显示。新闻行使用 `slug` 设置详情地址，并在 `article_zh`、`article_en` 中填写中英文 Markdown 文件名。
- `research.csv`：研究方向
- `publications.csv`：论文列表、代表论文和成果图。列为 `year`、`title_zh`、`title_en`、`authors`、`journal`、`image`、`featured`、`url`；`image` 只写 `public/images/publications` 里的文件名，`featured` 推荐写 `yes/no`。
- `members.csv`：当前成员、毕业学生、头像和中英文教师简介。列为 `status`、`identity`、`name`、`study_years`、`photo`、`faculty_intro`、`faculty_intro_en`、`destination`、`destination_en`；每行都需明确填写 `status` 和 `identity`，`name` 可写成 `胡锦程，Jincheng Hu`，`photo` 只写 `public/images/members` 里的精确文件名。毕业学生不显示照片，使用 `destination` 和 `destination_en` 填写中英文毕业去向。
- `gallery.csv`：课题组风采图片；同一组的多张图片写在 `image` 列中，并使用 `|` 分隔。
- `contact.csv`：站点信息、首页简介、联系方式
- `links.csv`：底部相关链接

图片放在 `public/images` 的分类目录中，例如 `public/images/home`、`public/images/members`、`public/images/publications`。CSV 里的图片路径写公开路径，例如 `/images/members/li-feng.jpg`。

新闻正文放在 `src/data/news` 中，网页会自动读取该目录下的 Markdown 文件。新闻图片建议放在 `public/images/news/新闻名称` 中，并在 Markdown 里使用 `/images/news/...` 的公开路径引用。

网页使用的优化图片放在 `public/images` 中；被替换的高清原图统一保存在工作区根目录的 `original-images` 中。该目录已排除出 Git、Vite 构建和 Vercel 部署，请在本地或其他存储位置单独备份。

不要手动改 `dist` 里的内容，`dist` 是 `npm.cmd run build` 生成的构建产物，重新构建或部署时会被覆盖。
