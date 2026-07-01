import contactCsv from './csv/contact.csv?raw';
import galleryCsv from './csv/gallery.csv?raw';
import homeCsv from './csv/home.csv?raw';
import linksCsv from './csv/links.csv?raw';
import membersCsv from './csv/members.csv?raw';
import publicationsCsv from './csv/publications.csv?raw';
import researchCsv from './csv/research.csv?raw';

export type HeroSlide = {
  eyebrow: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  alt: string;
  altEn?: string;
  caption: string;
  captionEn?: string;
};

export type ResearchDirection = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn?: string;
  detail: string;
  detailEn?: string;
  keywords: string[];
  keywordsEn?: string[];
  image: string;
};

export type Publication = {
  year: number;
  title: string;
  titleEn?: string;
  authors: string;
  journal: string;
  featured: boolean;
  image?: string;
  url?: string;
};

export type Member = {
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  education?: string;
  educationEn?: string;
  research?: string;
  researchEn?: string;
  email?: string;
  image: string;
  identity?: string;
  status?: 'current' | 'alumni';
  isFaculty?: boolean;
  isAlumni?: boolean;
};

export type MemberGroup = {
  label: string;
  labelEn?: string;
  members: Member[];
};

export type MemberSection = {
  title: string;
  titleEn?: string;
  intro: string;
  introEn?: string;
  groups: MemberGroup[];
};

export type GalleryItem = {
  title: string;
  titleEn?: string;
  date: string;
  description: string;
  descriptionEn?: string;
  image: string;
  alt: string;
  altEn?: string;
};

export type NewsItem = {
  date: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
};

export type RelatedLink = {
  label: string;
  labelEn?: string;
  url: string;
};

type CsvRow = Record<string, string>;

type ContactMap = Record<string, { zh: string; en: string }>;

type OrderedMember = Member & {
  order: number;
};

type OrderedMemberGroup = Omit<MemberGroup, 'members'> & {
  order: number;
  members: OrderedMember[];
};

type OrderedMemberSection = Omit<MemberSection, 'groups'> & {
  order: number;
  groups: OrderedMemberGroup[];
};

function parseCsv(source: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        continue;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const cleanedRows = rows.filter((cells) => cells.some((cell) => cell.trim()));
  const [headers = [], ...dataRows] = cleanedRows;

  return dataRows.map((cells) =>
    headers.reduce<CsvRow>((record, header, index) => {
      record[header.trim()] = decodeCsvValue(cells[index] ?? '');
      return record;
    }, {}),
  );
}

function decodeCsvValue(value: string) {
  return value.trim().replace(/\\n/g, '\n');
}

function sortByOrder<T extends CsvRow>(rows: T[], key = 'order') {
  return [...rows].sort((a, b) => numberValue(a[key]) - numberValue(b[key]));
}

function numberValue(value: string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolValue(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return Boolean(normalized && ['true', 'yes', 'y', '1', '是', '代表'].includes(normalized));
}

function listValue(value: string | undefined) {
  return (value ?? '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalValue(value: string | undefined) {
  return value?.trim() || undefined;
}

function splitMemberName(value: string) {
  const [name, nameEn] = value
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    name: name || value,
    nameEn: nameEn || name || value,
  };
}

function translateIdentity(identity: string) {
  const dictionary: Record<string, string> = {
    教授: 'Professor',
    副教授: 'Associate Professor',
    讲师: 'Lecturer',
    博士后: 'Postdoctoral Researcher',
    博士生: 'Ph.D. Student',
    硕士生: "Master's Student",
    本科生: 'Undergraduate Student',
  };

  return dictionary[identity] ?? identity;
}

function translateStudyYears(studyYears: string | undefined) {
  return studyYears?.replace('至今', 'present');
}

function isFacultyIdentity(identity: string) {
  return ['教授', '讲师', '副教授', 'faculty'].includes(identity.trim().toLowerCase());
}

function memberImagePath(photo: string | undefined) {
  const filename = photo?.trim();
  if (!filename) return '/images/members/avatar-student-placeholder.png';
  return filename.startsWith('/') ? filename : `/images/members/${filename}`;
}

function publicationImagePath(photo: string | undefined) {
  const filename = photo?.trim();
  if (!filename) return undefined;
  return filename.startsWith('/') ? filename : `/images/publications/${filename}`;
}

function getContactValue(contactMap: ContactMap, key: string, language: 'zh' | 'en' = 'zh') {
  return contactMap[key]?.[language] ?? '';
}

const homeRows = parseCsv(homeCsv);
const contactRows = parseCsv(contactCsv);
const contactMap = contactRows.reduce<ContactMap>((map, row) => {
  if (row.key) {
    map[row.key] = {
      zh: row.value_zh ?? '',
      en: row.value_en ?? '',
    };
  }
  return map;
}, {});

export const siteInfo = {
  name: getContactValue(contactMap, 'name'),
  nameEn: getContactValue(contactMap, 'name', 'en'),
  chineseName: getContactValue(contactMap, 'chineseName'),
  chineseNameEn: getContactValue(contactMap, 'chineseName', 'en'),
  tagline: getContactValue(contactMap, 'tagline'),
  taglineEn: getContactValue(contactMap, 'tagline', 'en'),
  institution: getContactValue(contactMap, 'institution'),
  institutionEn: getContactValue(contactMap, 'institution', 'en'),
  pi: getContactValue(contactMap, 'pi'),
  piEn: getContactValue(contactMap, 'pi', 'en'),
  email: getContactValue(contactMap, 'email'),
  phone: getContactValue(contactMap, 'phone'),
  address: getContactValue(contactMap, 'address'),
  addressEn: getContactValue(contactMap, 'address', 'en'),
  office: getContactValue(contactMap, 'office'),
  officeEn: getContactValue(contactMap, 'office', 'en'),
  lab: getContactValue(contactMap, 'lab'),
  labEn: getContactValue(contactMap, 'lab', 'en'),
  googleScholar: getContactValue(contactMap, 'googleScholar'),
  homeBody: getContactValue(contactMap, 'homeBody'),
  homeBodyEn: getContactValue(contactMap, 'homeBody', 'en'),
  contactNote: getContactValue(contactMap, 'contactNote'),
  contactNoteEn: getContactValue(contactMap, 'contactNote', 'en'),
  contactChecklist: listValue(getContactValue(contactMap, 'contactChecklist')),
  contactChecklistEn: listValue(getContactValue(contactMap, 'contactChecklist', 'en')),
  mapImage: getContactValue(contactMap, 'mapImage'),
  mapImageEn: getContactValue(contactMap, 'mapImage', 'en'),
  logo: '/images/logo/logo-transparent.png',
};

export const relatedLinks: RelatedLink[] = sortByOrder(parseCsv(linksCsv)).map((row) => ({
  label: row.label_zh,
  labelEn: optionalValue(row.label_en),
  url: row.url,
}));

export const heroSlides: HeroSlide[] = sortByOrder(homeRows.filter((row) => row.kind === 'hero')).map((row) => ({
  eyebrow: '',
  title: row.title_zh,
  titleEn: optionalValue(row.title_en),
  description: row.description_zh,
  descriptionEn: optionalValue(row.description_en),
  image: row.image,
  alt: row.alt_zh,
  altEn: optionalValue(row.alt_en),
  caption: row.caption_zh,
  captionEn: optionalValue(row.caption_en),
}));

export const researchDirections: ResearchDirection[] = sortByOrder(parseCsv(researchCsv)).map((row) => ({
  id: row.id,
  title: row.title_zh,
  titleEn: row.title_en,
  summary: row.summary_zh,
  summaryEn: optionalValue(row.summary_en),
  detail: row.detail_zh,
  detailEn: optionalValue(row.detail_en),
  keywords: listValue(row.keywords_zh),
  keywordsEn: listValue(row.keywords_en),
  image: row.image,
}));

export const publications: Publication[] = parseCsv(publicationsCsv)
  .map((row) => ({
    year: numberValue(row.year),
    title: row.title_zh,
    titleEn: optionalValue(row.title_en),
    authors: row.authors,
    journal: row.journal || row.journal_zh || row.journal_en,
    featured: boolValue(row.featured),
    image: publicationImagePath(row.image),
    url: optionalValue(row.url),
  }))
  .sort((a, b) => b.year - a.year);

const memberGroupOrder: Record<string, number> = {
  教师: 1,
  博士后: 2,
  博士生: 3,
  硕士生: 4,
  本科生: 5,
};

const memberSectionsByStatus: OrderedMemberSection[] = [
  {
    order: 1,
    title: '当前成员',
    titleEn: 'Current Members',
    intro: '',
    introEn: '',
    groups: [],
  },
  {
    order: 2,
    title: '以往学生',
    titleEn: 'Alumni',
    intro: '',
    introEn: '',
    groups: [],
  },
];

function addMemberToGroup(
  section: OrderedMemberSection,
  groupLabel: string,
  groupLabelEn: string,
  groupOrder: number,
  member: OrderedMember,
) {
  let group = section.groups.find((item) => item.label === groupLabel);
  if (!group) {
    group = {
      order: groupOrder,
      label: groupLabel,
      labelEn: groupLabelEn,
      members: [],
    };
    section.groups.push(group);
  }
  group.members.push(member);
}

parseCsv(membersCsv).forEach((row, index) => {
  const status = row.status === 'alumni' ? 'alumni' : 'current';
  const section = memberSectionsByStatus.find((item) => (status === 'alumni' ? item.title === '以往学生' : item.title === '当前成员'));
  if (!section) return;

  const identity = row.identity || '';
  const facultyIntro = optionalValue(row.faculty_intro);
  const isFaculty = status === 'current' && isFacultyIdentity(identity);
  const { name, nameEn } = splitMemberName(row.name);
  const studyYears = optionalValue(row.study_years);
  const groupLabel = isFaculty ? '教师' : identity;
  const groupLabelEn = isFaculty ? 'Faculty' : translateIdentity(identity);
  const groupOrder = isFaculty ? 1 : memberGroupOrder[identity] ?? 99;

  addMemberToGroup(section, groupLabel, groupLabelEn, groupOrder, {
    order: index + 1,
    name,
    nameEn,
    role: identity,
    roleEn: translateIdentity(identity),
    education: studyYears,
    educationEn: translateStudyYears(studyYears),
    research: isFaculty ? facultyIntro : undefined,
    researchEn: isFaculty ? facultyIntro : undefined,
    image: memberImagePath(row.photo),
    identity,
    status,
    isFaculty,
    isAlumni: status === 'alumni',
  });
});

export const memberSections: MemberSection[] = memberSectionsByStatus
  .filter((section) => section.groups.length)
  .sort((a, b) => a.order - b.order)
  .map(({ order: _sectionOrder, groups, ...section }) => ({
    ...section,
    groups: groups
      .sort((a, b) => a.order - b.order)
      .map(({ order: _groupOrder, ...group }) => ({
        ...group,
        members: group.members
          .sort((a, b) => a.order - b.order)
          .map(({ order: _memberOrder, ...member }) => member),
      })),
  }));

export const galleryItems: GalleryItem[] = sortByOrder(parseCsv(galleryCsv)).map((row) => ({
  title: row.title_zh,
  titleEn: optionalValue(row.title_en),
  date: row.date,
  description: row.description_zh,
  descriptionEn: optionalValue(row.description_en),
  image: row.image,
  alt: row.alt_zh,
  altEn: optionalValue(row.alt_en),
}));

export const newsItems: NewsItem[] = sortByOrder(homeRows.filter((row) => row.kind === 'news')).map((row) => ({
  date: row.date,
  title: row.title_zh,
  titleEn: optionalValue(row.title_en),
  description: row.description_zh,
  descriptionEn: optionalValue(row.description_en),
}));
