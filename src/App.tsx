import { useEffect, useMemo, useState } from 'react';
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
  type Publication,
} from './data/siteData';

type Route =
  | '/'
  | '/research'
  | '/publications'
  | '/members/current'
  | '/members/alumni'
  | '/gallery'
  | '/contact';

type NavItem = {
  path: Route;
  label: string;
  children?: { path: Route; label: string }[];
};

const navItems: NavItem[] = [
  { path: '/', label: '首页' },
  { path: '/research', label: '研究方向' },
  { path: '/publications', label: '论文发表' },
  {
    path: '/members/current',
    label: '成员',
    children: [
      { path: '/members/current', label: '当前成员' },
      { path: '/members/alumni', label: '以往成员' },
    ],
  },
  { path: '/gallery', label: '课题组风采' },
  { path: '/contact', label: '联系方式' },
];

const COMPACT_ENTER_SCROLL = 180;
const COMPACT_EXIT_SCROLL = 8;

function getCurrentRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  if (hash === '/members') return '/members/current';
  const routePaths = navItems.flatMap((item) => [item.path, ...(item.children?.map((child) => child.path) ?? [])]);
  return routePaths.includes(hash as Route) ? (hash as Route) : '/';
}

function App() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getCurrentRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Header route={route} navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />
      <main id="main-content">{renderRoute(route)}</main>
      <Footer />
    </>
  );
}

function renderRoute(route: Route) {
  switch (route) {
    case '/research':
      return <ResearchPage />;
    case '/publications':
      return <PublicationsPage />;
    case '/members/current':
      return <MembersPage view="current" />;
    case '/members/alumni':
      return <MembersPage view="alumni" />;
    case '/gallery':
      return <GalleryPage />;
    case '/contact':
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

function Header({
  route,
  navOpen,
  onToggleNav,
}: {
  route: Route;
  navOpen: boolean;
  onToggleNav: () => void;
}) {
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.scrollY > COMPACT_ENTER_SCROLL);

  useEffect(() => {
    setMemberMenuOpen(false);
  }, [route]);

  useEffect(() => {
    const updateCompact = () => {
      const scrollY = window.scrollY;
      setCompact((current) => {
        if (current) return scrollY > COMPACT_EXIT_SCROLL;
        return scrollY > COMPACT_ENTER_SCROLL;
      });
    };
    updateCompact();
    window.addEventListener('scroll', updateCompact, { passive: true });
    return () => window.removeEventListener('scroll', updateCompact);
  }, []);

  return (
    <header className={compact ? 'site-header compact' : 'site-header'}>
      <div className="header-inner">
        <a className="brand header-brand" href="#/" aria-label="Feng Lab 首页">
          <span className="brand-full">
            <strong>Welcome to Feng Lab</strong>
            <small>核酸功能材料实验室</small>
          </span>
          <span className="brand-compact" aria-hidden="true">
            <img className="header-compact-logo" src="/logo.jpg" alt="" />
            <span>Feng Lab</span>
          </span>
        </a>
        <button
          className="icon-button nav-toggle"
          type="button"
          title={navOpen ? '关闭导航' : '打开导航'}
          aria-label={navOpen ? '关闭导航' : '打开导航'}
          aria-expanded={navOpen}
          onClick={onToggleNav}
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav className={navOpen ? 'site-nav open' : 'site-nav'} aria-label="主导航">
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
                {item.label}
                <ChevronDown size={15} />
              </button>
              <div className="nav-dropdown-menu">
                {item.children.map((child) => (
                  <a key={child.path} className={route === child.path ? 'active' : ''} href={`#${child.path}`}>
                    {child.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a key={item.path} className={route === item.path ? 'active' : ''} href={`#${item.path}`}>
              {item.label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <HeroCarousel />
      <section className="section section-white home-overview">
        <div className="container home-overview-grid">
          <div className="home-overview-copy">
            <SectionTitle
              eyebrow="About Feng Lab"
              title="核酸功能材料实验室"
              intro={siteInfo.tagline}
            />
            <p className="body-copy">
              Feng Lab 聚焦核酸功能材料、响应性分子体系与生物医用应用，围绕精准诊疗、分子识别和材料界面等方向开展交叉研究。网站将用于展示课题组研究方向、论文成果、团队成员与日常风采，也欢迎对相关方向感兴趣的同学和合作伙伴与我们联系。
            </p>
          </div>
          <aside className="home-news-panel" aria-label="最新动态">
            <p className="eyebrow">News</p>
            <h2>最新动态</h2>
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
          </aside>
        </div>
      </section>
    </>
  );
}

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = heroSlides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, 8200);
    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setActiveIndex((index + heroSlides.length) % heroSlides.length);

  return (
    <section className="hero-section" aria-label="首页大图轮播">
      <figure className="hero-figure">
        <div className="hero">
          <SmartImage src={slide.image} alt={slide.alt} className="hero-image" loading="eager" />
          <button
            className="hero-control hero-control-left"
            type="button"
            title="上一张"
            aria-label="上一张轮播图"
            onClick={() => goToSlide(activeIndex - 1)}
          >
            <ChevronLeft size={42} strokeWidth={1.7} />
          </button>
          <button
            className="hero-control hero-control-right"
            type="button"
            title="下一张"
            aria-label="下一张轮播图"
            onClick={() => goToSlide(activeIndex + 1)}
          >
            <ChevronRight size={42} strokeWidth={1.7} />
          </button>
          <div className="hero-dots" aria-label="轮播图切换">
            {heroSlides.map((item, index) => (
              <button
                key={item.title}
                className={index === activeIndex ? 'active' : ''}
                type="button"
                title={`切换到：${item.title}`}
                aria-label={`切换到：${item.title}`}
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
                <p className="card-kicker">{direction.titleEn}</p>
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

function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="研究方向"
        intro="初版采用 3 个主方向，便于首页展示、招生介绍和后续论文成果归类。"
      />
      <section className="section section-white">
        <div className="container direction-stack">
          {researchDirections.map((direction, index) => (
            <article className={index % 2 === 0 ? 'direction-detail' : 'direction-detail flipped'} key={direction.id}>
              <SmartImage src={direction.image} alt={direction.title} className="direction-image" />
              <div className="direction-copy">
                <p className="card-kicker">{direction.titleEn}</p>
                <h2>{direction.title}</h2>
                <p>{direction.detail}</p>
                <div className="tag-list">
                  {direction.keywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PublicationsPage() {
  const featuredPapers = publications.filter((publication) => publication.featured);
  const groupedPublications = useMemo(() => {
    return publications.reduce<Record<number, Publication[]>>((groups, publication) => {
      groups[publication.year] = [...(groups[publication.year] ?? []), publication];
      return groups;
    }, {});
  }, []);
  const years = Object.keys(groupedPublications)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="论文发表"
        intro="保留代表论文和按年份归档两种浏览方式，兼顾学术展示与长期维护。"
      />
      <section className="section section-white">
        <div className="container">
          <SectionTitle eyebrow="Selected Work" title="代表论文" intro="替换真实论文后，建议选择 3-6 篇最能代表课题组方向的成果。" />
          <div className="paper-feature-grid">
            {featuredPapers.map((publication) => (
              <PaperCard key={publication.title} publication={publication} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <SectionTitle eyebrow="All Publications" title="完整列表" intro="按年份自动分组，后续只需在数据文件中追加论文。" />
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

function MembersPage({ view }: { view: 'current' | 'alumni' }) {
  const visibleSections = memberSections.filter((section) =>
    view === 'current' ? section.title !== '以往学生' : section.title === '以往学生',
  );

  return (
    <>
      <PageHero
        eyebrow={view === 'current' ? 'Current Members' : 'Alumni'}
        title={view === 'current' ? '当前成员' : '以往成员'}
        intro={
          view === 'current'
            ? '当前成员包括教师、博士后、博士生和硕士生。'
            : '记录曾在课题组学习和工作的成员、毕业年份与后续去向。'
        }
      />
      <section className="section section-white">
        <div className="container member-sections">
          {visibleSections.map((section) => (
            <section className="member-section" key={section.title} aria-labelledby={`member-${section.title}`}>
              <div className="member-section-head">
                <p className="eyebrow">
                  {section.title === '现有学生' ? 'Current Students' : section.title === '以往学生' ? 'Alumni' : 'Faculty'}
                </p>
                <h2 id={`member-${section.title}`}>{section.title}</h2>
                <p>{section.intro}</p>
              </div>
              {section.groups.map((group) => (
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
          ))}
        </div>
      </section>
    </>
  );
}

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="课题组风采"
        intro="用于展示合照、会议、实验室日常和论文成果图，帮助访问者看到真实团队氛围。"
      />
      <section className="section section-white">
        <div className="container gallery-grid">
          {galleryItems.map((item) => (
            <article className="gallery-card" key={item.title}>
              <SmartImage src={item.image} alt={item.alt} className="gallery-image" />
              <div className="gallery-copy">
                <time>{item.date}</time>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="联系方式"
        intro="欢迎对功能分子系统、生物医用材料和精准诊疗方向感兴趣的学生、博士后与合作伙伴联系。"
      />
      <section className="section section-white">
        <div className="container contact-layout">
          <div className="contact-details">
            <ContactItem icon={<Mail size={22} />} title="邮箱" value={siteInfo.email} href={`mailto:${siteInfo.email}`} />
            <ContactItem icon={<Phone size={22} />} title="电话" value={siteInfo.phone} />
            <ContactItem icon={<MapPin size={22} />} title="地址" value={siteInfo.address} />
            <ContactItem icon={<BookOpen size={22} />} title="学术主页" value="Google Scholar / ORCID 待补充" href={siteInfo.googleScholar} />
          </div>
          <div className="contact-copy">
            <h2>招生与合作</h2>
            <p>{siteInfo.contactNote}</p>
            <ul className="check-list">
              <li>邮件主题建议包含：姓名、学校/单位、申请方向或合作主题。</li>
              <li>学生申请可附简历、成绩单、科研经历和感兴趣的研究方向。</li>
              <li>合作交流可简要说明问题背景、已有基础和希望讨论的合作方式。</li>
            </ul>
            <a className="button button-primary" href={`mailto:${siteInfo.email}`}>
              <Mail size={18} />
              发送邮件
            </a>
          </div>
          <div className="map-panel">
            <SmartImage src="/images/contact-map-placeholder.png" alt="Feng Lab 地址示意图占位" className="map-image" />
            <div>
              <h3>{siteInfo.institution}</h3>
              <p>{siteInfo.office}</p>
              <p>{siteInfo.lab}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactBand() {
  return (
    <section className="contact-band" aria-label="联系方式摘要">
      <div className="container contact-band-inner">
        <div>
          <p className="eyebrow">Contact</p>
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

function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
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

function PaperCard({ publication, compact = false }: { publication: Publication; compact?: boolean }) {
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
            查看论文
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a className="brand footer-brand" href="#/" aria-label="Feng Lab 首页">
            <img className="brand-logo" src="/logo.jpg" alt="Feng Lab logo" />
            <span>
              <strong>{siteInfo.name}</strong>
              <small>{siteInfo.taglineEn}</small>
            </span>
          </a>
          <p>{siteInfo.institution}</p>
        </div>
        <div>
          <h2>联系</h2>
          <p>{siteInfo.email}</p>
          <p>
            {siteInfo.address.split('\n').map((line) => (
              <span className="address-line" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
        <div>
          <h2>相关链接</h2>
          <div className="footer-links">
            {relatedLinks.map((link) => (
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
