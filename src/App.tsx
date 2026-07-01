import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  MapPin,
  Menu,
  Phone,
  Users,
  X,
} from 'lucide-react';
import {
  galleryItems,
  heroSlides,
  memberSections,
  newsItems,
  publications,
  relatedLinks,
  researchDirections,
  siteInfo,
  type GalleryItem,
  type HeroSlide,
  type MemberSection,
  type NewsItem,
  type Publication,
  type RelatedLink,
  type ResearchDirection,
} from './data/siteData';

type Route =
  | '/'
  | '/research'
  | '/publications'
  | '/members/current'
  | '/members/alumni'
  | '/gallery'
  | '/contact';

type Language = 'zh' | 'en';

type NavItem = {
  path: Route;
  label: Record<Language, string>;
  children?: { path: Route; label: Record<Language, string> }[];
};

const navItems: NavItem[] = [
  { path: '/', label: { zh: '首页', en: 'Home' } },
  { path: '/research', label: { zh: '研究方向', en: 'Research' } },
  { path: '/publications', label: { zh: '论文发表', en: 'Publications' } },
  {
    path: '/members/current',
    label: { zh: '成员', en: 'Members' },
    children: [
      { path: '/members/current', label: { zh: '当前成员', en: 'Current Members' } },
      { path: '/members/alumni', label: { zh: '以往成员', en: 'Alumni' } },
    ],
  },
  { path: '/gallery', label: { zh: '课题组风采', en: 'Gallery' } },
  { path: '/contact', label: { zh: '联系方式', en: 'Contact' } },
];

const COMPACT_ENTER_SCROLL = 180;
const COMPACT_EXIT_SCROLL = 8;
const MOBILE_HEADER_QUERY = '(max-width: 760px)';
const PRESERVE_COMPACT_NAV_KEY = 'fenglab:preserve-compact-navigation';
const HEADER_COMPACT_STATE_KEY = 'fenglab:header-is-compact';
const LANGUAGE_STORAGE_KEY = 'fenglab:language';

const copy = {
  zh: {
    documentTitle: '北京化工大学李凤课题组',
    skipLink: '跳到主要内容',
    headerTitle: 'Welcome to Feng-Lab@BUCT',
    headerSubtitle: '核酸功能材料实验室',
    languageToggle: 'English',
    navLabel: '主导航',
    closeNav: '关闭导航',
    openNav: '打开导航',
    homeAria: 'Feng Lab 首页',
    home: {
      title: '核酸功能材料实验室',
      intro: siteInfo.tagline,
      body:
        'Feng Lab 聚焦核酸功能材料、响应性分子体系与生物医用应用，围绕精准诊疗、分子识别和材料界面等方向开展交叉研究。网站将用于展示课题组研究方向、论文成果、团队成员与日常风采，也欢迎对相关方向感兴趣的同学和合作伙伴与我们联系。',
      newsTitle: '最新动态',
    },
    hero: {
      aria: '首页大图轮播',
      previous: '上一张',
      previousAria: '上一张轮播图',
      next: '下一张',
      nextAria: '下一张轮播图',
      dotsAria: '轮播图切换',
      switchTo: '切换到：',
    },
    publications: {
      selectedTitle: '代表论文',
      selectedIntro: '替换真实论文后，建议选择 3-6 篇最能代表课题组方向的成果。',
      allTitle: '完整列表',
      allIntro: '按年份自动分组，后续只需在数据文件中追加论文。',
      viewPaper: '查看论文',
    },
    members: {
      current: '当前成员',
      alumni: '以往成员',
    },
    contact: {
      email: '邮箱',
      phone: '电话',
      address: '地址',
      scholar: '学术主页',
      scholarValue: 'Google Scholar / ORCID 待补充',
      collaborationTitle: '招生与合作',
      note: siteInfo.contactNote,
      sendEmail: '发送邮件',
      checkList: [
        '邮件主题建议包含：姓名、学校/单位、申请方向或合作主题。',
        '学生申请可附简历、成绩单、科研经历和感兴趣的研究方向。',
        '合作交流可简要说明问题背景、已有基础和希望讨论的合作方式。',
      ],
    },
    footer: {
      contact: '联系',
      links: '相关链接',
    },
  },
  en: {
    documentTitle: 'Feng Lab | Beijing University of Chemical Technology',
    skipLink: 'Skip to main content',
    headerTitle: 'Welcome to Feng-Lab@BUCT',
    headerSubtitle: 'Nucleic Acid Functional Materials Laboratory',
    languageToggle: '中文',
    navLabel: 'Main navigation',
    closeNav: 'Close navigation',
    openNav: 'Open navigation',
    homeAria: 'Feng Lab home',
    home: {
      title: 'Nucleic Acid Functional Materials Laboratory',
      intro: 'Functional molecular systems for biomedical materials and precision theranostics.',
      body:
        'Feng Lab develops nucleic acid functional materials, responsive molecular systems, and biomedical platforms for precision diagnosis and therapy. The website introduces our research directions, publications, members, lab life, and opportunities for students and collaborators.',
      newsTitle: 'News',
    },
    hero: {
      aria: 'Homepage carousel',
      previous: 'Previous',
      previousAria: 'Previous slide',
      next: 'Next',
      nextAria: 'Next slide',
      dotsAria: 'Carousel navigation',
      switchTo: 'Switch to: ',
    },
    publications: {
      selectedTitle: 'Selected Publications',
      selectedIntro: 'After real publications are added, this section can highlight 3-6 representative papers.',
      allTitle: 'Full Publication List',
      allIntro: 'Publications are grouped by year and can be maintained from the data file.',
      viewPaper: 'View paper',
    },
    members: {
      current: 'Current Members',
      alumni: 'Alumni',
    },
    contact: {
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      scholar: 'Academic Profiles',
      scholarValue: 'Google Scholar / ORCID to be added',
      collaborationTitle: 'Join and Collaborate',
      note:
        'Students, postdoctoral researchers, and collaborators interested in functional materials, biomedical polymers, molecular imaging, and interdisciplinary research are welcome to contact us by email.',
      sendEmail: 'Send email',
      checkList: [
        'Please include your name, institution, and intended research or collaboration topic in the email subject.',
        'Student applicants may attach a CV, transcript, research experience, and areas of interest.',
        'Collaboration inquiries may briefly describe the background, current basis, and preferred discussion format.',
      ],
    },
    footer: {
      contact: 'Contact',
      links: 'Related Links',
    },
  },
};

const englishHeroSlides = [
  {
    title: '2026 Feng Group',
    alt: '2026 Feng Group photo',
    caption: '2026 Feng Group',
  },
  {
    title: 'Representative Research Output',
    alt: 'Representative publication figure placeholder',
    caption: 'Publication figure placeholder; replace with real published results later.',
  },
  {
    title: 'Life in Feng Lab',
    alt: 'Lab life placeholder',
    caption: 'Lab life placeholder; replace with real activity photos later.',
  },
];

const englishResearchDirections: Record<
  string,
  Pick<ResearchDirection, 'title' | 'summary' | 'detail' | 'keywords'>
> = {
  'responsive-biomaterials': {
    title: 'Responsive Biomedical Materials',
    summary:
      'Designing controllable functional materials that assemble, release, and degrade in response to disease microenvironments and external stimuli.',
    detail:
      'This direction highlights the scientific questions, molecular design strategies, material platforms, and biomedical applications of responsive systems. Mechanistic schemes and publication figures can be added later to connect the problem, strategy, and application.',
    keywords: ['Polymeric materials', 'Stimuli response', 'Drug delivery', 'Biointerfaces'],
  },
  'molecular-imaging': {
    title: 'Molecular Probes and Theranostics',
    summary:
      'Developing molecular probes and multifunctional diagnostic platforms for disease detection, therapy, and response evaluation.',
    detail:
      'This direction can feature fluorescence, photoacoustic, radioactive, magnetic resonance, or multimodal imaging work, with emphasis on how probe design supports disease detection and precision treatment.',
    keywords: ['Molecular probes', 'Multimodal imaging', 'Theranostics', 'Precision medicine'],
  },
  'interfaces-translation': {
    title: 'Material Interfaces and Translational Applications',
    summary:
      'Studying interactions between materials, cells, tissues, and complex biological environments to support translational applications.',
    detail:
      'This direction can include collaborative projects, instrument platforms, animal studies, or translational work, helping visitors understand how material systems are advanced toward real application scenarios.',
    keywords: ['Material interfaces', 'Cell interactions', 'Tissue repair', 'Translational research'],
  },
};

const englishPublications: Partial<Publication>[] = [
  {
    title: 'Placeholder paper: Responsive polymeric materials for precision delivery',
    journal: 'Journal / DOI to be added',
    note: 'Representative paper placeholder. A publication figure or TOC image can be kept here.',
    tags: ['Selected paper', 'Biomedical materials'],
  },
  {
    title: 'Placeholder paper: Visual molecular probes for disease microenvironment detection',
    journal: 'Journal / DOI to be added',
    tags: ['Selected paper', 'Molecular imaging'],
  },
  {
    title: 'Placeholder paper: Biointerface-regulating material systems',
    journal: 'Journal / DOI to be added',
    tags: ['Selected paper', 'Material interfaces'],
  },
  {
    title: 'Placeholder paper: Nanomaterial assembly and functional enhancement',
    journal: 'Journal / DOI to be added',
    tags: ['Nanomaterials'],
  },
  {
    title: 'Placeholder paper: Structure-property relationships in functional molecular systems',
    journal: 'Journal / DOI to be added',
    tags: ['Functional molecules'],
  },
  {
    title: 'Placeholder paper: Polymer platforms for biological applications',
    journal: 'Journal / DOI to be added',
    tags: ['Polymers'],
  },
];

const englishMemberSections: MemberSection[] = [
  {
    title: 'Faculty',
    intro: 'Information for the PI, collaborating faculty, and permanent research staff.',
    groups: [
      {
        label: 'Faculty',
        members: [
          {
            name: 'Prof. Feng Li',
            role: 'Principal Investigator',
            education: 'Education and professional experience to be added',
            research: 'Functional molecular systems, biomedical materials, and precision theranostics',
            email: 'fenglab@example.edu.cn',
            image: '/images/avatar-teacher-placeholder.png',
          },
        ],
      },
    ],
  },
  {
    title: 'Current Students',
    intro: 'Current members are grouped by postdoctoral fellows, PhD students, and master students.',
    groups: [
      {
        label: 'Postdoctoral Fellows',
        members: [
          {
            name: 'Postdoctoral fellow placeholder',
            role: 'Postdoctoral Fellow',
            education: 'PhD institution to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-researcher-placeholder.png',
          },
        ],
      },
      {
        label: 'PhD Students',
        members: [
          {
            name: 'PhD student placeholder A',
            role: 'PhD Student',
            education: 'Enrollment year to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: 'PhD student placeholder B',
            role: 'PhD Student',
            education: 'Enrollment year to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-student-placeholder.png',
          },
        ],
      },
      {
        label: 'Master Students',
        members: [
          {
            name: 'Master student placeholder A',
            role: 'Master Student',
            education: 'Enrollment year to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: 'Master student placeholder B',
            role: 'Master Student',
            education: 'Enrollment year to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-student-placeholder.png',
          },
          {
            name: 'Master student placeholder C',
            role: 'Master Student',
            education: 'Enrollment year to be added',
            research: 'Research direction to be added',
            image: '/images/avatar-student-placeholder.png',
          },
        ],
      },
    ],
  },
  {
    title: 'Alumni',
    intro: 'Former students and their graduation years or career destinations can be recorded here.',
    groups: [
      {
        label: 'Alumni',
        members: [
          {
            name: 'Alumnus placeholder',
            role: 'Graduation year / destination to be added',
            research: 'Thesis topic or research direction to be added',
            image: '/images/avatar-alumni-placeholder.png',
          },
        ],
      },
    ],
  },
];

const englishGalleryItems: GalleryItem[] = [
  {
    title: 'Group Photo',
    date: '2026',
    description: 'Group photos can be used to show the team and updated each year.',
    image: '/images/gallery-group-placeholder.png',
    alt: 'Group photo placeholder',
  },
  {
    title: 'Academic Conferences',
    date: '2026',
    description: 'Talks, posters, conference discussions, and awards can be recorded here.',
    image: '/images/gallery-conference-placeholder.png',
    alt: 'Academic conference placeholder',
  },
  {
    title: 'Lab Life',
    date: '2026',
    description: 'Experiments, group meetings, discussions, and instrument platforms.',
    image: '/images/gallery-lab-placeholder.png',
    alt: 'Lab life placeholder',
  },
  {
    title: 'Publication Highlights',
    date: '2026',
    description: 'Cover images, TOC figures, and representative research outputs can be shown here.',
    image: '/images/gallery-paper-placeholder.png',
    alt: 'Publication highlight placeholder',
  },
];

const englishNewsItems: NewsItem[] = [
  {
    date: '2026-06',
    title: 'Feng Lab website construction started',
    description: 'Research content, member information, and publication records will be added step by step.',
  },
  {
    date: '2026-05',
    title: 'Students interested in interdisciplinary research are welcome to contact us',
    description: 'Students with backgrounds in chemistry, materials, biomedical science, or related fields are welcome.',
  },
  {
    date: '2026-04',
    title: 'Representative publications and figures to be updated',
    description: 'Publication records can be maintained in the data file and highlighted on the homepage.',
  },
];

const englishRelatedLinks: RelatedLink[] = [
  { label: 'Beijing University of Chemical Technology', url: 'https://www.buct.edu.cn/main.htm' },
  { label: 'College of Chemistry, BUCT', url: 'https://chemistry.buct.edu.cn/main.htm' },
];

function getHeroSlide(slide: HeroSlide, index: number, language: Language): HeroSlide {
  if (language === 'zh') return slide;
  return {
    ...slide,
    ...englishHeroSlides[index],
  };
}

function getResearchDirection(direction: ResearchDirection, language: Language): ResearchDirection {
  if (language === 'zh') return direction;
  return {
    ...direction,
    ...englishResearchDirections[direction.id],
  };
}

function getPublication(publication: Publication, index: number, language: Language): Publication {
  if (language === 'zh') return publication;
  return {
    ...publication,
    ...englishPublications[index],
  };
}

function getMemberSection(section: MemberSection, index: number, language: Language): MemberSection {
  return language === 'zh' ? section : englishMemberSections[index] ?? section;
}

function getGalleryItem(item: GalleryItem, index: number, language: Language): GalleryItem {
  return language === 'zh' ? item : englishGalleryItems[index] ?? item;
}

function getNewsItems(language: Language): NewsItem[] {
  return language === 'zh' ? newsItems : englishNewsItems;
}

function getRelatedLinks(language: Language): RelatedLink[] {
  return language === 'zh' ? relatedLinks : englishRelatedLinks;
}

function isMobileHeader() {
  return window.matchMedia(MOBILE_HEADER_QUERY).matches;
}

function getInitialLanguage(): Language {
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'zh';
}

function getCurrentRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  if (hash === '/members') return '/members/current';
  const routePaths = navItems.flatMap((item) => [item.path, ...(item.children?.map((child) => child.path) ?? [])]);
  return routePaths.includes(hash as Route) ? (hash as Route) : '/';
}

function App() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [navOpen, setNavOpen] = useState(false);
  const [forceCompactHeader, setForceCompactHeaderState] = useState(false);
  const forceCompactHeaderRef = useRef(false);
  const t = copy[language];

  const setForceCompactHeader = (next: boolean) => {
    forceCompactHeaderRef.current = next;
    setForceCompactHeaderState(next);
  };

  useEffect(() => {
    const handleHashChange = () => setRoute(getCurrentRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t.documentTitle;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, t.documentTitle]);

  useEffect(() => {
    const shouldPreserveCompact =
      !isMobileHeader() &&
      Boolean(
        forceCompactHeaderRef.current ||
          sessionStorage.getItem(PRESERVE_COMPACT_NAV_KEY) === '1' ||
          sessionStorage.getItem(HEADER_COMPACT_STATE_KEY) === '1' ||
          window.scrollY > COMPACT_ENTER_SCROLL ||
          document.querySelector('.site-header')?.classList.contains('compact'),
      );
    sessionStorage.removeItem(PRESERVE_COMPACT_NAV_KEY);
    setForceCompactHeader(shouldPreserveCompact);
    if (shouldPreserveCompact) {
      window.dispatchEvent(new Event('fenglab:preserve-compact-header'));
    }
    setNavOpen(false);
    if (shouldPreserveCompact) {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0 });
      window.setTimeout(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.skipLink}
      </a>
      <Header
        route={route}
        language={language}
        navOpen={navOpen}
        forceCompactHeader={forceCompactHeader}
        onToggleNav={() => setNavOpen((open) => !open)}
        onToggleLanguage={() => {
          setLanguage((current) => (current === 'zh' ? 'en' : 'zh'));
          setNavOpen(false);
        }}
        onPreserveCompactHeader={() => setForceCompactHeader(true)}
        onReleaseCompactHeader={() => setForceCompactHeader(false)}
      />
      <main id="main-content">{renderRoute(route, language)}</main>
      <Footer language={language} />
    </>
  );
}

function renderRoute(route: Route, language: Language) {
  switch (route) {
    case '/research':
      return <ResearchPage language={language} />;
    case '/publications':
      return <PublicationsPage language={language} />;
    case '/members/current':
      return <MembersPage view="current" language={language} />;
    case '/members/alumni':
      return <MembersPage view="alumni" language={language} />;
    case '/gallery':
      return <GalleryPage language={language} />;
    case '/contact':
      return <ContactPage language={language} />;
    default:
      return <HomePage language={language} />;
  }
}

function Header({
  route,
  language,
  navOpen,
  forceCompactHeader,
  onToggleNav,
  onToggleLanguage,
  onPreserveCompactHeader,
  onReleaseCompactHeader,
}: {
  route: Route;
  language: Language;
  navOpen: boolean;
  forceCompactHeader: boolean;
  onToggleNav: () => void;
  onToggleLanguage: () => void;
  onPreserveCompactHeader: () => void;
  onReleaseCompactHeader: () => void;
}) {
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.scrollY > COMPACT_ENTER_SCROLL);
  const [forceCompact, setForceCompact] = useState(false);
  const compactRef = useRef(compact);
  const forceCompactRef = useRef(false);
  const forceCompactHeaderRef = useRef(forceCompactHeader);
  const preserveCompactOnRouteRef = useRef(false);
  const hasSeenInitialRouteRef = useRef(false);

  const setForcedCompact = (next: boolean) => {
    forceCompactRef.current = next;
    setForceCompact(next);
  };

  useEffect(() => {
    setMemberMenuOpen(false);
  }, [route]);

  useEffect(() => {
    compactRef.current = compact || forceCompact || forceCompactHeader;
    forceCompactHeaderRef.current = forceCompactHeader;
  }, [compact, forceCompact, forceCompactHeader]);

  useLayoutEffect(() => {
    if (!hasSeenInitialRouteRef.current) {
      hasSeenInitialRouteRef.current = true;
      return;
    }

    const shouldPreserveCompact =
      !isMobileHeader() &&
      (sessionStorage.getItem(PRESERVE_COMPACT_NAV_KEY) === '1' ||
        sessionStorage.getItem(HEADER_COMPACT_STATE_KEY) === '1' ||
        compactRef.current ||
        document.querySelector('.site-header')?.classList.contains('compact'));

    if (shouldPreserveCompact) {
      preserveCompactOnRouteRef.current = true;
      sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '1');
      onPreserveCompactHeader();
      setForcedCompact(true);
      setCompact(true);
    }
  }, [route]);

  useEffect(() => {
    const updateCompact = () => {
      if (isMobileHeader()) {
        preserveCompactOnRouteRef.current = false;
        setForcedCompact(false);
        onReleaseCompactHeader();
        sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '0');
        setCompact(false);
        return;
      }

      const scrollY = window.scrollY;
      if (preserveCompactOnRouteRef.current) {
        sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '1');
        setForcedCompact(true);
        if (scrollY <= COMPACT_EXIT_SCROLL) {
          preserveCompactOnRouteRef.current = false;
          setCompact(true);
        }
        return;
      }

      if ((forceCompactRef.current || forceCompactHeaderRef.current) && scrollY <= COMPACT_ENTER_SCROLL) {
        sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '1');
        return;
      }
      if (forceCompactRef.current && scrollY > COMPACT_ENTER_SCROLL) {
        setForcedCompact(false);
      }
      if (forceCompactHeaderRef.current && scrollY > COMPACT_ENTER_SCROLL) {
        onReleaseCompactHeader();
      }

      setCompact((current) => {
        const next = current ? scrollY > COMPACT_EXIT_SCROLL : scrollY > COMPACT_ENTER_SCROLL;
        sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, next ? '1' : '0');
        return next;
      });
    };
    const preserveCompactOnRoute = () => {
      const shouldPreserveCompact =
        !isMobileHeader() &&
        (compactRef.current ||
          forceCompactRef.current ||
          sessionStorage.getItem(HEADER_COMPACT_STATE_KEY) === '1' ||
          document.querySelector('.site-header')?.classList.contains('compact'));

      if (shouldPreserveCompact) {
        preserveCompactOnRouteRef.current = true;
        onPreserveCompactHeader();
        setForcedCompact(true);
        sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '1');
        setCompact(true);
      }
    };
    updateCompact();
    window.addEventListener('scroll', updateCompact, { passive: true });
    window.addEventListener('resize', updateCompact);
    window.addEventListener('hashchange', preserveCompactOnRoute);
    window.addEventListener('fenglab:preserve-compact-header', preserveCompactOnRoute);
    return () => {
      window.removeEventListener('scroll', updateCompact);
      window.removeEventListener('resize', updateCompact);
      window.removeEventListener('hashchange', preserveCompactOnRoute);
      window.removeEventListener('fenglab:preserve-compact-header', preserveCompactOnRoute);
    };
  }, []);

  const preserveCompactForNavigation = () => {
    const isCurrentlyCompact =
      compactRef.current || document.querySelector('.site-header')?.classList.contains('compact');
    if (!isMobileHeader() && isCurrentlyCompact) {
      preserveCompactOnRouteRef.current = true;
      onPreserveCompactHeader();
      setForcedCompact(true);
      sessionStorage.setItem(PRESERVE_COMPACT_NAV_KEY, '1');
      sessionStorage.setItem(HEADER_COMPACT_STATE_KEY, '1');
      setCompact(true);
      return true;
    }
    return false;
  };

  const handleNavLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, path: Route) => {
    event.preventDefault();
    preserveCompactForNavigation();
    window.setTimeout(() => {
      const oldURL = window.location.href;
      const nextHash = `#${path}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState(null, '', nextHash);
        window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
      }
    }, 0);
  };

  const handleLanguageClick = () => {
    preserveCompactForNavigation();
    onToggleLanguage();
  };

  const t = copy[language];

  return (
    <header className={compact || forceCompact || forceCompactHeader ? 'site-header compact' : 'site-header'}>
      <div className="header-inner">
        <a className="brand header-brand" href="#/" aria-label={t.homeAria}>
          <span className="brand-full">
            <img className="header-mobile-logo" src="/logo-transparent.png" alt="" />
            <strong>{t.headerTitle}</strong>
            <small>{t.headerSubtitle}</small>
          </span>
          <span className="brand-compact" aria-hidden="true">
            <img className="header-compact-logo" src="/logo-transparent.png" alt="" />
            <span>Feng Lab</span>
          </span>
        </a>
        <button
          className="icon-button nav-toggle"
          type="button"
          title={navOpen ? t.closeNav : t.openNav}
          aria-label={navOpen ? t.closeNav : t.openNav}
          aria-expanded={navOpen}
          onClick={onToggleNav}
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav className={navOpen ? 'site-nav open' : 'site-nav'} aria-label={t.navLabel}>
        {navItems.map((item) =>
          item.children ? (
            <div
              className={`nav-dropdown ${route.startsWith('/members/') ? 'active' : ''} ${memberMenuOpen ? 'open' : ''}`}
              key={item.path}
            >
              <button
                className="nav-dropdown-trigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={memberMenuOpen}
                onClick={() => setMemberMenuOpen((open) => !open)}
              >
                {item.label[language]}
                <ChevronDown size={15} />
              </button>
              <div className="nav-dropdown-menu">
                {item.children.map((child) => (
                    <a
                      key={child.path}
                      className={route === child.path ? 'active' : ''}
                      href={`#${child.path}`}
                      onClick={(event) => handleNavLinkClick(event, child.path)}
                    >
                      {child.label[language]}
                    </a>
                ))}
              </div>
            </div>
          ) : (
              <a
                key={item.path}
                className={route === item.path ? 'active' : ''}
                href={`#${item.path}`}
                onClick={(event) => handleNavLinkClick(event, item.path)}
              >
                {item.label[language]}
              </a>
          ),
        )}
        <button className="language-toggle" type="button" onClick={handleLanguageClick}>
          {t.languageToggle}
        </button>
      </nav>
    </header>
  );
}

function HomePage({ language }: { language: Language }) {
  const t = copy[language].home;
  const currentNewsItems = getNewsItems(language);

  return (
    <>
      <HeroCarousel language={language} />
      <section className="section section-white home-overview">
        <div className="container home-overview-grid">
          <div className="home-overview-copy">
            <SectionTitle title={t.title} intro={t.intro} />
            <p className="body-copy">{t.body}</p>
          </div>
          <aside className="home-news-panel" aria-label={t.newsTitle}>
            <h2>{t.newsTitle}</h2>
            <div className="news-list">
              {currentNewsItems.map((item) => (
                <article className="news-item" key={item.title}>
                  <time>{item.date}</time>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function HeroCarousel({ language }: { language: Language }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = getHeroSlide(heroSlides[activeIndex], activeIndex, language);
  const t = copy[language].hero;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, 8200);
    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setActiveIndex((index + heroSlides.length) % heroSlides.length);

  return (
    <section className="hero-section" aria-label={t.aria}>
      <figure className="hero-figure">
        <div className="hero">
          <SmartImage src={slide.image} alt={slide.alt} className="hero-image" loading="eager" />
          <button
            className="hero-control hero-control-left"
            type="button"
            title={t.previous}
            aria-label={t.previousAria}
            onClick={() => goToSlide(activeIndex - 1)}
          >
            <ChevronLeft size={42} strokeWidth={1.7} />
          </button>
          <button
            className="hero-control hero-control-right"
            type="button"
            title={t.next}
            aria-label={t.nextAria}
            onClick={() => goToSlide(activeIndex + 1)}
          >
            <ChevronRight size={42} strokeWidth={1.7} />
          </button>
          <div className="hero-dots" aria-label={t.dotsAria}>
            {heroSlides.map((item, index) => (
              <button
                key={item.title}
                className={index === activeIndex ? 'active' : ''}
                type="button"
                title={`${t.switchTo}${getHeroSlide(item, index, language).title}`}
                aria-label={`${t.switchTo}${getHeroSlide(item, index, language).title}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
        <figcaption className="hero-caption">{slide.caption}</figcaption>
      </figure>
    </section>
  );
}

function ResearchPreview() {
  return (
    <section className="section section-soft">
      <div className="container">
        <SectionTitle
          eyebrow="Research"
          title="三个主方向构成清晰的研究入口"
          intro="首页先让访问者快速理解 Feng Lab 关注什么；研究方向页再展开每个方向的背景、策略和代表成果。"
        />
        <div className="card-grid three">
          {researchDirections.map((direction) => (
            <article className="research-card" key={direction.id}>
              <SmartImage src={direction.image} alt={direction.title} className="card-image" />
              <div className="card-body">
                <h3>{direction.title}</h3>
                <p>{direction.summary}</p>
                <div className="tag-list">
                  {direction.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="section-action">
          <a className="text-link" href="#/research">
            查看完整研究方向
            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedPublications({ publications: featuredPublications }: { publications: Publication[] }) {
  return (
    <section className="section section-white">
      <div className="container">
        <SectionTitle
          eyebrow="Publications"
          title="代表论文与成果图优先展示"
          intro="论文页保留完整列表，首页只放最能代表课题组方向的成果。"
        />
        <div className="paper-feature-grid">
          {featuredPublications.map((publication) => (
            <PaperCard key={publication.title} publication={publication} compact />
          ))}
        </div>
        <div className="section-action">
          <a className="text-link" href="#/publications">
            查看全部论文
            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

function NewsJoin() {
  return (
    <section className="section section-soft">
      <div className="container two-column">
        <div>
          <SectionTitle
            eyebrow="News"
            title="最新动态"
            intro="这里用于轻量展示新闻、招生和代表成果更新，不额外增加导航复杂度。"
          />
          <div className="news-list">
            {newsItems.map((item) => (
              <article className="news-item" key={item.title}>
                <time>{item.date}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="join-panel" aria-label="加入我们">
          <GraduationCap size={30} />
          <h2>加入 Feng Lab</h2>
          <p>{siteInfo.contactNote}</p>
          <a className="button button-primary" href="#/contact">
            <Mail size={18} />
            联系课题组
          </a>
        </aside>
      </div>
    </section>
  );
}

function ResearchPage({ language }: { language: Language }) {
  return (
    <section className="section section-white">
      <div className="container direction-stack">
        {researchDirections.map((direction, index) => {
          const displayDirection = getResearchDirection(direction, language);

          return (
            <article className={index % 2 === 0 ? 'direction-detail' : 'direction-detail flipped'} key={direction.id}>
              <SmartImage src={direction.image} alt={displayDirection.title} className="direction-image" />
              <div className="direction-copy">
                <h2>{displayDirection.title}</h2>
                <p>{displayDirection.detail}</p>
                <div className="tag-list">
                  {displayDirection.keywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PublicationsPage({ language }: { language: Language }) {
  const t = copy[language].publications;
  const displayedPublications = useMemo(
    () => publications.map((publication, index) => getPublication(publication, index, language)),
    [language],
  );
  const featuredPapers = displayedPublications.filter((publication) => publication.featured);
  const groupedPublications = useMemo(() => {
    return displayedPublications.reduce<Record<number, Publication[]>>((groups, publication) => {
      groups[publication.year] = [...(groups[publication.year] ?? []), publication];
      return groups;
    }, {});
  }, [displayedPublications]);
  const years = Object.keys(groupedPublications)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <section className="section section-white">
        <div className="container">
          <SectionTitle title={t.selectedTitle} intro={t.selectedIntro} />
          <div className="paper-feature-grid">
            {featuredPapers.map((publication) => (
              <PaperCard key={publication.title} publication={publication} language={language} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <SectionTitle title={t.allTitle} intro={t.allIntro} />
          <div className="publication-years">
            {years.map((year) => (
              <section className="publication-year" key={year} aria-labelledby={`year-${year}`}>
                <h2 id={`year-${year}`}>{year}</h2>
                <div className="publication-list">
                  {groupedPublications[year].map((publication) => (
                    <PaperListItem key={publication.title} publication={publication} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MembersPage({ view, language }: { view: 'current' | 'alumni'; language: Language }) {
  const visibleSections = memberSections.filter((section) =>
    view === 'current' ? section.title !== '以往学生' : section.title === '以往学生',
  );

  return (
    <section className="section section-white">
      <div className="container member-sections">
        {visibleSections.map((section) => {
          const sectionIndex = memberSections.indexOf(section);
          const displaySection = getMemberSection(section, sectionIndex, language);

          return (
            <section
              className="member-section"
              key={section.title}
              aria-labelledby={`member-${displaySection.title}`}
            >
              <div className="member-section-head">
                <h2 id={`member-${displaySection.title}`}>{displaySection.title}</h2>
                <p>{displaySection.intro}</p>
              </div>
              {displaySection.groups.map((group) => (
                <div className="member-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <div className="member-grid">
                    {group.members.map((member) => (
                      <article className="member-card" key={`${group.label}-${member.name}`}>
                        <SmartImage src={member.image} alt={member.name} className="member-photo" />
                        <div className="member-info">
                          <h4>{member.name}</h4>
                          <p className="member-role">{member.role}</p>
                          {member.education && <p>{member.education}</p>}
                          {member.research && <p>{member.research}</p>}
                          {member.email && (
                            <a className="inline-link" href={`mailto:${member.email}`}>
                              {member.email}
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function GalleryPage({ language }: { language: Language }) {
  return (
    <section className="section section-white">
      <div className="container gallery-grid">
        {galleryItems.map((item, index) => {
          const displayItem = getGalleryItem(item, index, language);

          return (
            <article className="gallery-card" key={item.title}>
              <SmartImage src={displayItem.image} alt={displayItem.alt} className="gallery-image" />
              <div className="gallery-copy">
                <time>{displayItem.date}</time>
                <h2>{displayItem.title}</h2>
                <p>{displayItem.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ContactPage({ language }: { language: Language }) {
  const t = copy[language].contact;
  const address =
    language === 'zh'
      ? siteInfo.address
      : '15 Beisanhuan East Road, Chaoyang District, Beijing\nRoom 108, Huaxin Building, East Campus, Beijing University of Chemical Technology';

  return (
    <section className="section section-white">
      <div className="container contact-layout">
        <div className="contact-details">
          <ContactItem icon={<Mail size={22} />} title={t.email} value={siteInfo.email} href={`mailto:${siteInfo.email}`} />
          <ContactItem icon={<Phone size={22} />} title={t.phone} value={siteInfo.phone} />
          <ContactItem icon={<MapPin size={22} />} title={t.address} value={address} />
          <ContactItem icon={<BookOpen size={22} />} title={t.scholar} value={t.scholarValue} href={siteInfo.googleScholar} />
        </div>
        <div className="contact-copy">
          <h2>{t.collaborationTitle}</h2>
          <p>{t.note}</p>
          <ul className="check-list">
            {t.checkList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="button button-primary" href={`mailto:${siteInfo.email}`}>
            <Mail size={18} />
            {t.sendEmail}
          </a>
        </div>
        <div className="map-panel">
          <SmartImage src="/images/contact-map-placeholder.png" alt="Feng Lab address map placeholder" className="map-image" />
          <div>
            <h3>{language === 'zh' ? siteInfo.institution : 'Feng Lab, Beijing University of Chemical Technology'}</h3>
            <p>{language === 'zh' ? siteInfo.office : '15 Beisanhuan East Road, Chaoyang District, Beijing'}</p>
            <p>{language === 'zh' ? siteInfo.lab : 'Room 108, Huaxin Building, East Campus'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBand() {
  return (
    <section className="contact-band" aria-label="联系方式摘要">
      <div className="container contact-band-inner">
        <div>
          <h2>欢迎加入、访问和合作交流</h2>
        </div>
        <div className="contact-band-actions">
          <a className="button button-secondary" href={`mailto:${siteInfo.email}`}>
            <Mail size={18} />
            {siteInfo.email}
          </a>
          <a className="button button-primary" href="#/contact">
            <MapPin size={18} />
            查看联系方式
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, intro }: { eyebrow?: string; title: string; intro: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function PaperCard({
  publication,
  compact = false,
  language = 'zh',
}: {
  publication: Publication;
  compact?: boolean;
  language?: Language;
}) {
  const t = copy[language].publications;

  return (
    <article className={compact ? 'paper-card compact' : 'paper-card'}>
      {publication.image && <SmartImage src={publication.image} alt={publication.title} className="paper-image" />}
      <div className="paper-body">
        <p className="paper-meta">
          <CalendarDays size={16} />
          {publication.year} · {publication.journal}
        </p>
        <h3>{publication.title}</h3>
        <p className="paper-authors">{publication.authors}</p>
        {publication.note && <p>{publication.note}</p>}
        <div className="tag-list">
          {publication.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {publication.url && (
          <a className="inline-link" href={publication.url} target="_blank" rel="noreferrer">
            {t.viewPaper}
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </article>
  );
}

function PaperListItem({ publication }: { publication: Publication }) {
  return (
    <article className="paper-list-item">
      <div>
        <h3>{publication.title}</h3>
        <p>{publication.authors}</p>
        <p className="paper-journal">{publication.journal}</p>
      </div>
      <div className="tag-list">
        {publication.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function ContactItem({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="contact-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>
          {value.split('\n').map((line) => (
            <span className="address-line" key={line}>
              {line}
            </span>
          ))}
        </small>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="contact-item" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }

  return <div className="contact-item">{content}</div>;
}

function SmartImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: {
  src: string;
  alt: string;
  className: string;
  loading?: 'lazy' | 'eager';
}) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`${className} image-fallback`} role="img" aria-label={alt}>
        <ImageIcon size={28} />
        <span>{alt}</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading={loading} onError={() => setFailed(true)} />;
}

function Footer({ language }: { language: Language }) {
  const t = copy[language].footer;
  const links = getRelatedLinks(language);
  const institution = language === 'zh' ? siteInfo.institution : 'Feng Lab, Beijing University of Chemical Technology';
  const address =
    language === 'zh'
      ? siteInfo.address
      : '15 Beisanhuan East Road, Chaoyang District, Beijing\nRoom 108, Huaxin Building, East Campus';

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a className="brand footer-brand" href="#/" aria-label={copy[language].homeAria}>
            <img className="brand-logo" src="/logo.jpg" alt="Feng Lab logo" />
            <span>
              <strong>{siteInfo.name}</strong>
              <small>{copy[language].headerSubtitle}</small>
            </span>
          </a>
          <p>{institution}</p>
        </div>
        <div>
          <h2>{t.contact}</h2>
          <p>{siteInfo.email}</p>
          <p>
            {address.split('\n').map((line) => (
              <span className="address-line" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
        <div>
          <h2>{t.links}</h2>
          <div className="footer-links">
            {links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
