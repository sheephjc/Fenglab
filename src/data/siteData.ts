export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  caption: string;
};

export type ResearchDirection = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  detail: string;
  keywords: string[];
  image: string;
};

export type Publication = {
  year: number;
  title: string;
  authors: string;
  journal: string;
  featured: boolean;
  image?: string;
  note?: string;
  url?: string;
  tags: string[];
};

export type Member = {
  name: string;
  role: string;
  education?: string;
  research?: string;
  email?: string;
  image: string;
};

export type MemberGroup = {
  label: string;
  members: Member[];
};

export type MemberSection = {
  title: string;
  intro: string;
  groups: MemberGroup[];
};

export type GalleryItem = {
  title: string;
  date: string;
  description: string;
  image: string;
  alt: string;
};

export type NewsItem = {
  date: string;
  title: string;
  description: string;
};

export type RelatedLink = {
  label: string;
  url: string;
};

export const siteInfo = {
  name: 'Feng Lab',
  chineseName: '李凤课题组',
  tagline: '面向生物医用材料与精准诊疗的功能分子系统',
  taglineEn: 'Nucleic Acid Functional Materials Laboratory',
  institution: '北京化工大学李凤课题组',
  pi: '李凤教授',
  email: 'fenglab@example.edu.cn',
  phone: '000-0000-0000',
  address: '北京市朝阳区北三环东路15号\n北京化工大学东校区化新楼108室',
  office: '北京市朝阳区北三环东路15号',
  lab: '北京化工大学东校区化新楼108室',
  googleScholar: 'https://scholar.google.com/',
  contactNote:
    '欢迎对功能材料、生物医用高分子、分子影像和交叉学科研究感兴趣的本科生、研究生与博士后邮件联系。',
};

export const relatedLinks: RelatedLink[] = [
  {
    label: '北京化工大学',
    url: 'https://www.buct.edu.cn/main.htm',
  },
  {
    label: '北京化工大学化学学院',
    url: 'https://chemistry.buct.edu.cn/main.htm',
  },
];

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Research Group',
    title: '从分子设计到生物医用材料',
    description:
      'Feng Lab 关注功能分子、响应性材料与精准诊疗交叉方向，致力于建立可被临床问题牵引的材料化学研究体系。',
    image: '/images/hero1-2026%20Feng%20Group.png',
    alt: 'Feng Lab 课题组合照占位图',
    caption: '2026 Feng Group',
  },
  {
    eyebrow: 'Publications',
    title: '以代表性成果连接基础研究与应用场景',
    description:
      '首页轮播可展示论文图、TOC 图、封面图或重要成果示意图，让访问者快速理解课题组的研究亮点。',
    image: '/images/hero-paper-placeholder.png',
    alt: '论文成果图占位图',
    caption: '论文成果图占位，后续替换为真实发表成果',
  },
  {
    eyebrow: 'Life in Lab',
    title: '开放、认真、互相支持的科研氛围',
    description:
      '课题组风采用于展示会议交流、组会讨论、实验室日常和毕业合影，帮助学生和合作伙伴了解真实团队状态。',
    image: '/images/hero-lab-placeholder.png',
    alt: '实验室风采占位图',
    caption: '实验室风采占位，后续替换为真实活动照片',
  },
];

export const researchDirections: ResearchDirection[] = [
  {
    id: 'responsive-biomaterials',
    title: '响应性生物医用材料',
    titleEn: 'Responsive Biomaterials',
    summary: '围绕疾病微环境和外源刺激，设计可控组装、释放与降解的功能材料。',
    detail:
      '初版可放置该方向的研究背景、关键科学问题、材料体系和代表性应用。建议后续补充 1-2 张机制图或论文 TOC 图，形成“问题-策略-应用”的叙事。',
    keywords: ['高分子材料', '刺激响应', '药物递送', '生物界面'],
    image: '/images/research-materials-placeholder.png',
  },
  {
    id: 'molecular-imaging',
    title: '分子诊疗探针与成像',
    titleEn: 'Molecular Imaging & Theranostics',
    summary: '发展面向诊断、治疗和疗效评估的分子探针与多功能诊疗平台。',
    detail:
      '该方向适合突出荧光、光声、放射、磁共振或多模态成像相关成果，并说明探针设计如何服务于疾病检测和精准治疗。',
    keywords: ['分子探针', '多模态成像', '诊疗一体化', '精准医学'],
    image: '/images/research-imaging-placeholder.png',
  },
  {
    id: 'interfaces-translation',
    title: '材料界面与转化应用',
    titleEn: 'Interfaces & Translation',
    summary: '研究材料与细胞、组织及复杂生物环境的相互作用，推动应用转化。',
    detail:
      '该方向可承接合作项目、仪器平台、动物实验或产业转化内容，帮助访问者理解课题组如何把材料体系推进到真实应用场景。',
    keywords: ['材料界面', '细胞互作', '组织修复', '转化研究'],
    image: '/images/research-interface-placeholder.png',
  },
];

export const publications: Publication[] = [
  {
    year: 2026,
    title: '论文题目占位：响应性高分子材料用于精准递送',
    authors: 'Feng Lab members, Collaborators, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: true,
    image: '/images/publication-1-placeholder.png',
    note: '代表论文占位，替换时建议保留论文图或 TOC 图。',
    tags: ['代表论文', '生物医用材料'],
  },
  {
    year: 2026,
    title: '论文题目占位：可视化分子探针与疾病微环境检测',
    authors: 'Feng Lab members, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: true,
    image: '/images/publication-2-placeholder.png',
    tags: ['代表论文', '分子成像'],
  },
  {
    year: 2025,
    title: '论文题目占位：生物界面调控材料体系',
    authors: 'Feng Lab members, Collaborators, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: true,
    image: '/images/publication-3-placeholder.png',
    tags: ['代表论文', '材料界面'],
  },
  {
    year: 2025,
    title: '论文题目占位：纳米材料组装与功能增强',
    authors: 'Feng Lab members, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: false,
    tags: ['纳米材料'],
  },
  {
    year: 2024,
    title: '论文题目占位：功能分子系统的结构-性能关系',
    authors: 'Feng Lab members, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: false,
    tags: ['功能分子'],
  },
  {
    year: 2024,
    title: '论文题目占位：面向生物应用的聚合物平台',
    authors: 'Feng Lab members, Collaborators, F. Feng*',
    journal: 'Journal / DOI 待补充',
    featured: false,
    tags: ['聚合物'],
  },
];

export const memberSections: MemberSection[] = [
  {
    title: '教师',
    intro: '展示 PI、合作教师或实验室固定研究人员信息。',
    groups: [
      {
        label: '教师',
        members: [
          {
            name: '李凤教授',
            role: '课题组负责人 / Principal Investigator',
            education: '教育与工作经历待补充',
            research: '功能分子系统、生物医用材料、精准诊疗',
            email: 'fenglab@example.edu.cn',
            image: '/images/avatar-teacher-placeholder.png',
          },
        ],
      },
    ],
  },
  {
    title: '现有学生',
    intro: '现有学生按博士后、博士生、硕士生分组，后续可直接增删成员数据。',
    groups: [
      {
        label: '博士后',
        members: [
          {
            name: '博士后姓名占位',
            role: '博士后',
            education: '博士毕业院校待补充',
            research: '研究方向待补充',
            image: '/images/avatar-researcher-placeholder.png',
          },
        ],
      },
      {
        label: '博士生',
        members: [
          {
            name: '博士生姓名占位 A',
            role: '博士研究生',
            education: '入学年份待补充',
            research: '研究方向待补充',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: '博士生姓名占位 B',
            role: '博士研究生',
            education: '入学年份待补充',
            research: '研究方向待补充',
            image: '/images/avatar-student-placeholder.png',
          },
        ],
      },
      {
        label: '硕士生',
        members: [
          {
            name: '硕士生姓名占位 A',
            role: '硕士研究生',
            education: '入学年份待补充',
            research: '研究方向待补充',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: '硕士生姓名占位 B',
            role: '硕士研究生',
            education: '入学年份待补充',
            research: '研究方向待补充',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: '硕士生姓名占位 C',
            role: '硕士研究生',
            education: '入学年份待补充',
            research: '研究方向待补充',
            image: '/images/avatar-student-placeholder.png',
          },
        ],
      },
    ],
  },
  {
    title: '以往学生',
    intro: '以往学生可记录毕业去向，形成课题组长期档案。',
    groups: [
      {
        label: '校友',
        members: [
          {
            name: '校友姓名占位',
            role: '毕业年份 / 去向待补充',
            research: '毕业论文或研究方向待补充',
            image: '/images/avatar-alumni-placeholder.png',
          },
        ],
      },
    ],
  },
];

export const galleryItems: GalleryItem[] = [
  {
    title: '课题组合照',
    date: '2026',
    description: '用于展示团队成员合影，建议每年更新一次。',
    image: '/images/gallery-group-placeholder.png',
    alt: '课题组合照占位图',
  },
  {
    title: '学术会议',
    date: '2026',
    description: '记录报告、墙报、会议交流与获奖瞬间。',
    image: '/images/gallery-conference-placeholder.png',
    alt: '学术会议占位图',
  },
  {
    title: '实验室日常',
    date: '2026',
    description: '呈现实验、组会、讨论和仪器平台等日常场景。',
    image: '/images/gallery-lab-placeholder.png',
    alt: '实验室日常占位图',
  },
  {
    title: '论文成果',
    date: '2026',
    description: '可展示封面图、TOC 图和代表性成果图。',
    image: '/images/gallery-paper-placeholder.png',
    alt: '论文成果占位图',
  },
];

export const newsItems: NewsItem[] = [
  {
    date: '2026-06',
    title: 'Feng Lab 网站建设启动',
    description: '官网初版上线后，将逐步补充真实研究内容、成员信息和论文成果。',
  },
  {
    date: '2026-05',
    title: '欢迎对交叉研究感兴趣的同学联系',
    description: '课题组长期欢迎具有化学、材料、生物医学或相关背景的同学加入。',
  },
  {
    date: '2026-04',
    title: '代表论文与成果图待更新',
    description: '后续可在数据文件中维护论文列表，并在首页突出最新代表成果。',
  },
];
