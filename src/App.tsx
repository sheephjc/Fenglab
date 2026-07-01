import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
    headerSubtitle: siteInfo.tagline,
    languageToggle: 'English',
    navLabel: '主导航',
    closeNav: '关闭导航',
    openNav: '打开导航',
    homeAria: 'Feng Lab 首页',
    home: {
      title: '核酸功能材料实验室',
      intro: siteInfo.tagline,
      body: siteInfo.homeBody,
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
      selectedIntro: '',
      allTitle: '完整列表',
      allIntro: '',
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
      checkList: siteInfo.contactChecklist,
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
    headerSubtitle: siteInfo.taglineEn,
    languageToggle: '中文',
    navLabel: 'Main navigation',
    closeNav: 'Close navigation',
    openNav: 'Open navigation',
    homeAria: 'Feng Lab home',
    home: {
      title: 'Nucleic Acid Functional Materials Laboratory',
      intro: siteInfo.taglineEn,
      body: siteInfo.homeBodyEn,
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
      selectedIntro: '',
      allTitle: 'Full Publication List',
      allIntro: '',
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
      note: siteInfo.contactNoteEn,
      sendEmail: 'Send email',
      checkList: siteInfo.contactChecklistEn,
    },
    footer: {
      contact: 'Contact',
      links: 'Related Links',
    },
  },
};

function localizedText(zh: string, en: string | undefined, language: Language) {
  return language === 'en' && en ? en : zh;
}

function localizedList(zh: string[], en: string[] | undefined, language: Language) {
  return language === 'en' && en?.length ? en : zh;
}

function getHeroSlide(slide: HeroSlide, _index: number, language: Language): HeroSlide {
  if (language === 'zh') return slide;
  return {
    ...slide,
    title: localizedText(slide.title, slide.titleEn, language),
    description: localizedText(slide.description, slide.descriptionEn, language),
    alt: localizedText(slide.alt, slide.altEn, language),
    caption: localizedText(slide.caption, slide.captionEn, language),
  };
}

function getResearchDirection(direction: ResearchDirection, language: Language): ResearchDirection {
  if (language === 'zh') return direction;
  return {
    ...direction,
    title: localizedText(direction.title, direction.titleEn, language),
    summary: localizedText(direction.summary, direction.summaryEn, language),
    detail: localizedText(direction.detail, direction.detailEn, language),
    keywords: localizedList(direction.keywords, direction.keywordsEn, language),
  };
}

function getPublication(publication: Publication, _index: number, _language: Language): Publication {
  return publication;
}

function getMemberSection(section: MemberSection, _index: number, language: Language): MemberSection {
  if (language === 'zh') return section;
  return {
    ...section,
    title: localizedText(section.title, section.titleEn, language),
    intro: localizedText(section.intro, section.introEn, language),
    groups: section.groups.map((group) => ({
      ...group,
      label: localizedText(group.label, group.labelEn, language),
      members: group.members.map((member) => ({
        ...member,
        name: localizedText(member.name, member.nameEn, language),
        role: localizedText(member.role, member.roleEn, language),
        education: member.education
          ? localizedText(member.education, member.educationEn, language)
          : member.educationEn,
        research: member.research ? localizedText(member.research, member.researchEn, language) : member.researchEn,
      })),
    })),
  };
}

function getGalleryItem(item: GalleryItem, _index: number, language: Language): GalleryItem {
  if (language === 'zh') return item;
  return {
    ...item,
    title: localizedText(item.title, item.titleEn, language),
    description: localizedText(item.description, item.descriptionEn, language),
    alt: localizedText(item.alt, item.altEn, language),
  };
}

function getNewsItems(language: Language): NewsItem[] {
  if (language === 'zh') return newsItems;
  return newsItems.map((item) => ({
    ...item,
    title: localizedText(item.title, item.titleEn, language),
    description: localizedText(item.description, item.descriptionEn, language),
  }));
}

function getRelatedLinks(language: Language): RelatedLink[] {
  if (language === 'zh') return relatedLinks;
  return relatedLinks.map((link) => ({
    ...link,
    label: localizedText(link.label, link.labelEn, language),
  }));
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
            <img className="header-mobile-logo" src={siteInfo.logo} alt="" />
            <strong>{t.headerTitle}</strong>
            <small>{t.headerSubtitle}</small>
          </span>
          <span className="brand-compact" aria-hidden="true">
            <img className="header-compact-logo" src={siteInfo.logo} alt="" />
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
            <PaperCard key={publication.titleEn || publication.title} publication={publication} compact />
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
  const featuredPapers = displayedPublications.filter((publication) => publication.featured).slice(0, 4);
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
        <div className="container publication-container">
          <SectionTitle title={t.selectedTitle} intro={t.selectedIntro} />
          <div className="paper-feature-grid">
            {featuredPapers.map((publication) => (
              <PaperCard key={publication.titleEn || publication.title} publication={publication} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section-white publications-all-section">
        <div className="container publication-container">
          <SectionTitle title={t.allTitle} intro={t.allIntro} />
          <div className="publication-years">
            {years.map((year) => (
              <section className="publication-year" key={year} aria-labelledby={`year-${year}`}>
                <h2 id={`year-${year}`}>{year}</h2>
                <div className="publication-list">
                  {groupedPublications[year].map((publication) => (
                    <PaperListItem key={publication.titleEn || publication.title} publication={publication} />
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
                {displaySection.intro && <p>{displaySection.intro}</p>}
              </div>
              {displaySection.groups.map((group) => {
                const isFacultyGroup = group.members.some((member) => member.isFaculty);

                return (
                  <div className="member-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <div className={isFacultyGroup ? 'faculty-list' : 'student-grid'}>
                      {group.members.map((member) =>
                        member.isFaculty ? (
                          <article className="faculty-card" key={`${group.label}-${member.name}`}>
                            <SmartImage src={member.image} alt={member.name} className="faculty-photo" />
                            <div className="faculty-info">
                              <h4>{member.name}</h4>
                              <p className="member-role">{member.role}</p>
                              {member.research && <p>{member.research}</p>}
                            </div>
                          </article>
                        ) : (
                          <article className="student-card" key={`${group.label}-${member.name}`}>
                            <SmartImage src={member.image} alt={member.name} className="student-photo" />
                            <div className="student-info">
                              <h4>{member.name}</h4>
                              {member.education && <p>{member.education}</p>}
                            </div>
                          </article>
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
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
  const address = language === 'zh' ? siteInfo.address : siteInfo.addressEn;
  const institution = language === 'zh' ? siteInfo.institution : siteInfo.institutionEn;
  const office = language === 'zh' ? siteInfo.office : siteInfo.officeEn;
  const lab = language === 'zh' ? siteInfo.lab : siteInfo.labEn;
  const mapImage = language === 'zh' ? siteInfo.mapImage : siteInfo.mapImageEn;

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
          <SmartImage src={mapImage} alt="Feng Lab address map placeholder" className="map-image" />
          <div>
            <h3>{institution}</h3>
            <p>{office}</p>
            <p>{lab}</p>
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

function SectionTitle({ title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
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
}: {
  publication: Publication;
  compact?: boolean;
}) {
  const className = compact ? 'paper-card compact' : 'paper-card';
  const mainTitle = publication.titleEn || publication.title;
  const subtitle = publication.titleEn ? publication.title : undefined;

  const content = (
    <>
      <SmartImage src={publication.image ?? ''} alt={mainTitle} className="paper-image" />
      <div className="paper-body">
        <p className="paper-meta">
          <CalendarDays size={16} />
          {publication.year} · {publication.journal}
        </p>
        <h3>{mainTitle}</h3>
        {subtitle && <p className="paper-title-zh">{subtitle}</p>}
        <p className="paper-authors">{publication.authors}</p>
      </div>
    </>
  );

  if (publication.url) {
    return (
      <a className={className} href={publication.url} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <article className={className}>
      {content}
    </article>
  );
}

function PaperListItem({ publication }: { publication: Publication }) {
  const mainTitle = publication.titleEn || publication.title;
  const subtitle = publication.titleEn ? publication.title : undefined;
  const content = (
    <>
      <div>
        <h3>{mainTitle}</h3>
        {subtitle && <p className="paper-title-zh">{subtitle}</p>}
        <p>{publication.authors}</p>
        <p className="paper-journal">{publication.journal}</p>
      </div>
    </>
  );

  if (publication.url) {
    return (
      <a className="paper-list-item paper-list-link" href={publication.url} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <article className="paper-list-item">
      {content}
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
  const institution = language === 'zh' ? siteInfo.institution : siteInfo.institutionEn;
  const address = language === 'zh' ? siteInfo.address : siteInfo.addressEn;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a className="brand footer-brand" href="#/" aria-label={copy[language].homeAria}>
            <img className="brand-logo" src={siteInfo.logo} alt="Feng Lab logo" />
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
