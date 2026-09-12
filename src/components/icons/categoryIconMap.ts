import type { ComponentType } from 'react'
import { EyeIcon, LocationIcon, UserIcon } from './account'
import { PackageIcon } from './commerce'
import {
  ActivityIcon,
  AtomIcon,
  BanIcon,
  BedIcon,
  BodyScanIcon,
  BoneIcon,
  BrainIcon,
  BrightnessUpIcon,
  DigestionIcon,
  DnaIcon,
  DropletHalfIcon,
  DropletIcon,
  EarIcon,
  FishIcon,
  FlameIcon,
  FlowerIcon,
  GenderBigenderIcon,
  GenderFemaleIcon,
  GenderMaleIcon,
  HeartbeatIcon,
  HeartsIcon,
  LeafIcon,
  LungsIcon,
  MassageIcon,
  MoodNervousIcon,
  MoodSmileIcon,
  MoonStarsIcon,
  PhysiotherapistIcon,
  PlantIcon,
  ReportMedicalIcon,
  SaladIcon,
  ScaleIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
  SunIcon,
  ThermometerIcon,
  ToiletPaperIcon,
  VirusIcon,
  VirusSearchIcon,
  WindIcon,
} from './medical'
import {
  BandageIcon,
  BottleIcon,
  DentalIcon,
  FaceMaskIcon,
  FirstAidKitIcon,
  HandSanitizerIcon,
  MilkIcon,
  PillIcon,
  PillPlusIcon,
  PillsIcon,
  RazorElectricIcon,
  ShirtIcon,
  SprayIcon,
  ToolsIcon,
  VaccineIcon,
  WashHandIcon,
} from './pharmacy'
import { FileTextIcon, SearchIcon } from './ui'
import type { SvgIconProps } from './types'

type CategoryGlyph = ComponentType<SvgIconProps>

/** Exact last-segment match (avoids broad substring false positives). */
function is(slug: string, ...exact: string[]) {
  return exact.includes(slug)
}

function has(slug: string, ...parts: string[]) {
  return parts.some((p) => slug.includes(p))
}

/**
 * Ordered keyword → icon rules (first match wins).
 * Match against last path segment only (lowercase).
 * Prefer specific rules before broad ones — `hong` must not match inside `chong-*`.
 */
const CATEGORY_ICON_RULES: Array<{ match: (slug: string) => boolean; Icon: CategoryGlyph }> = [
  // —— Roots / L0 ——
  { match: (s) => is(s, 'thuoc'), Icon: PillsIcon },
  { match: (s) => is(s, 'cham-soc-ca-nhan'), Icon: UserIcon },
  { match: (s) => has(s, 'trang-thiet-bi', 'thiet-bi-y-te'), Icon: ToolsIcon },
  { match: (s) => has(s, 'thuc-pham-chuc-nang'), Icon: BottleIcon },
  { match: (s) => has(s, 'duoc-my-pham'), Icon: SparklesIcon },

  // —— Oral care ——
  {
    match: (s) =>
      has(s, 'rang-mieng', 'nha-khoa', 'ban-chai', 'kem-danh-rang', 'suc-mieng', 'boi-rang'),
    Icon: DentalIcon,
  },

  // —— Sexual health (before generic droplet) ——
  { match: (s) => has(s, 'bao-cao-su', 'gel-boi-tron'), Icon: HeartsIcon },
  { match: (s) => has(s, 'tinh-duc'), Icon: HeartsIcon },

  // —— Beauty tools (before dung-cu → stethoscope) ——
  { match: (s) => has(s, 'cao-rau', 'tay-long'), Icon: RazorElectricIcon },
  { match: (s) => has(s, 'thiet-bi-lam-dep'), Icon: RazorElectricIcon },

  // —— Sunscreen / UV (before `hong` bug in chong-*) ——
  { match: (s) => has(s, 'chong-nang'), Icon: SunIcon },

  // —— Face / sheet mask (before mat → eye) ——
  { match: (s) => is(s, 'mat-na') || has(s, 'mat-na'), Icon: MoodSmileIcon },
  { match: (s) => has(s, 'da-mat', 'duong-da-mat'), Icon: MoodSmileIcon },
  { match: (s) => has(s, 'vung-mat'), Icon: EyeIcon },
  { match: (s) => has(s, 'tay-trang'), Icon: SprayIcon },
  { match: (s) => has(s, 'serum', 'essence', 'ampoule'), Icon: DropletHalfIcon },

  // —— Skin solutions ——
  { match: (s) => has(s, 'sam-xin', 'mo-tham', 'seo'), Icon: BrightnessUpIcon },
  { match: (s) => has(s, 'kho-thieu-am', 'nut-da'), Icon: DropletHalfIcon },
  { match: (s) => has(s, 'kich-ung', 'viem-da', 'co-dia', 'nhay-cam'), Icon: HandSanitizerIcon },
  { match: (s) => has(s, 'lan-da', 'da-lieu'), Icon: HandSanitizerIcon },
  { match: (s) => has(s, 'boi-ngoai-da', 'boi-seo', 'sat-khuan', 'te-boi'), Icon: SprayIcon },

  // —— Body / hygiene ——
  { match: (s) => has(s, 've-sinh-phu-nu', 've-sinh'), Icon: WashHandIcon },
  { match: (s) => has(s, 'tay-chan'), Icon: HandSanitizerIcon },
  { match: (s) => has(s, 'cham-soc-nguc'), Icon: ShirtIcon },
  { match: (s) => has(s, 'cham-soc-co-the'), Icon: ShirtIcon },
  { match: (s) => has(s, 'cham-soc-da'), Icon: SprayIcon },

  // —— Hair ——
  {
    match: (s) =>
      has(s, 'dau-goi', 'duong-toc', 'u-toc', 'da-dau', 'cham-soc-toc', 'tri-gau', 'tri-nam') ||
      is(s, 'toc', 'dac-tri'),
    Icon: ScissorsIcon,
  },
  { match: (s) => is(s, 'da'), Icon: HandSanitizerIcon },

  // —— Makeup / beauty ——
  { match: (s) => has(s, 'son-moi', 'trang-diem', 'my-pham', 'lam-dep'), Icon: SparklesIcon },
  { match: (s) => has(s, 'thien-nhien', 'tinh-dau'), Icon: FlowerIcon },

  // —— Medical devices / first aid ——
  { match: (s) => has(s, 'khau-trang'), Icon: FaceMaskIcon },
  {
    match: (s) => has(s, 'bang-y-te', 'bong-y-te', 'vet-thuong', 'so-cuu'),
    Icon: FirstAidKitIcon,
  },
  { match: (s) => has(s, 'sat-trung', 'nuoc-muoi', 'con-va'), Icon: DropletIcon },
  { match: (s) => has(s, 'dung-cu-y-te', 'theo-doi'), Icon: ThermometerIcon },
  { match: (s) => has(s, 'dung-cu'), Icon: ToolsIcon },

  // —— Bones / joints / gout / muscle ——
  { match: (s) => has(s, 'gout'), Icon: BoneIcon },
  { match: (s) => has(s, 'xuong-khop', 'co-xuong-khop', 'thoai-hoa-khop'), Icon: BoneIcon },
  { match: (s) => has(s, 'gian-co'), Icon: PhysiotherapistIcon },

  // —— Digestion / gut (before broad thuoc) ——
  {
    match: (s) =>
      has(
        s,
        'tieu-hoa',
        'da-day',
        'ta-trang',
        'dai-trang',
        'kho-tieu',
        'an-ngon',
        'tao-bon',
        'loi-tieu',
      ),
    Icon: DigestionIcon,
  },
  { match: (s) => is(s, 'tri'), Icon: ToiletPaperIcon },
  { match: (s) => has(s, 'gan-mat', 'chuc-nang-gan', 'giai-ruou'), Icon: BodyScanIcon },

  // —— Cardio / blood (narrow `mau` — not da-sam-xin-mau) ——
  {
    match: (s) =>
      has(s, 'tim-mach', 'huyet-ap', 'cholesterol', 'tinh-mach', 'hoat-huyet', 'tuan-hoan') ||
      has(s, 'mo-mau', 'dong-mau', 'cam-mau', 'and-mau'),
    Icon: HeartbeatIcon,
  },
  { match: (s) => has(s, 'sam-xin-mau'), Icon: BrightnessUpIcon },

  // —— Respiratory / ENT (narrow: avoid matching `chong-*` via `hong`) ——
  { match: (s) => has(s, 'ho-hap', 'hen-suyen', 'ho-cam', 'xoang', 'so-mui'), Icon: LungsIcon },
  { match: (s) => has(s, 'nho-tai'), Icon: EarIcon },
  {
    match: (s) =>
      has(s, 'viem-hong', 'nho-mat', 'bao-ve-mat', 'ong-hit-mui', 'mat-tai-mui') ||
      /(^|-)hong(-|$)/.test(s) ||
      /(^|-)mui(-|$)/.test(s),
    Icon: EyeIcon,
  },
  { match: (s) => is(s, 'tai') || s.startsWith('tai-'), Icon: EarIcon },

  // —— Neuro / sleep / stress ——
  { match: (s) => has(s, 'than-kinh', 'bo-nao', 'nua-dau', 'tuan-hoan-nao'), Icon: BrainIcon },
  { match: (s) => has(s, 'giac-ngu', 'an-than'), Icon: MoonStarsIcon },
  { match: (s) => has(s, 'cang-thang', 'tram-cam'), Icon: MoodNervousIcon },
  { match: (s) => has(s, 'say-tau'), Icon: BedIcon },

  // —— Physiology / hormones ——
  { match: (s) => has(s, 'man-kinh', 'kinh-nguyet', 'am-dao'), Icon: GenderFemaleIcon },
  { match: (s) => has(s, 'sinh-ly-nam') || is(s, 'sinh-ly-nam'), Icon: GenderMaleIcon },
  { match: (s) => has(s, 'sinh-ly', 'noi-tiet', 'hormon'), Icon: GenderBigenderIcon },
  { match: (s) => has(s, 'tiet-nieu', 'sinh-duc'), Icon: DropletIcon },

  // —— Immunity / vitamins / minerals ——
  { match: (s) => has(s, 'de-khang', 'mien-dich'), Icon: ShieldCheckIcon },
  { match: (s) => has(s, 'dau-ca', 'omega', 'dha'), Icon: FishIcon },
  {
    match: (s) =>
      has(s, 'vitamin', 'khoang-chat', 'canxi', 'magie', 'axit-folic', 'bo-sung') ||
      has(s, 'kem-magie', 'sat-axit'),
    Icon: BottleIcon,
  },
  { match: (s) => has(s, 'dinh-duong'), Icon: SaladIcon },
  { match: (s) => has(s, 'sua') || is(s, 'sua') || has(s, 'baby'), Icon: MilkIcon },

  // —— Metabolic ——
  { match: (s) => has(s, 'tieu-duong'), Icon: ActivityIcon },
  { match: (s) => has(s, 'trao-doi-chat', 'cai-thien-tang-cuong'), Icon: ScaleIcon },
  { match: (s) => has(s, 'chong-lao-hoa'), Icon: SparklesIcon },

  // —— Treatment / oncology (ung-thu before dieu-tri) ——
  { match: (s) => has(s, 'ung-thu'), Icon: DnaIcon },
  { match: (s) => has(s, 'dieu-tri'), Icon: StethoscopeIcon },
  { match: (s) => has(s, 'giai-doc', 'cai-nghien', 'cai-thuoc-la', 'cap-cuu'), Icon: BanIcon },
  { match: (s) => has(s, 'di-ung', 'dich-ung'), Icon: LeafIcon },

  // —— Pain / fever / inflammation ——
  { match: (s) => has(s, 'mieng-dan', 'cao-xoa'), Icon: BandageIcon },
  { match: (s) => has(s, 'giam-dau', 'ha-sot', 'khang-viem'), Icon: PillIcon },
  { match: (s) => has(s, 'dau-gio'), Icon: WindIcon },
  { match: (s) => has(s, 'dau-nong', 'xoa-bop', 'mu-u'), Icon: FlameIcon },
  { match: (s) => has(s, 'massage'), Icon: MassageIcon },

  // —— Anti-infectives ——
  { match: (s) => has(s, 'khang-sinh', 'khang-nam'), Icon: VirusIcon },
  { match: (s) => has(s, 'khang-virus', 'khang-lao'), Icon: VirusSearchIcon },
  { match: (s) => has(s, 'tiem-chich', 'dich-truyen', 'vac-xin', 'dung-dich-tiem'), Icon: VaccineIcon },

  // —— Electrolyte / tonic ——
  { match: (s) => has(s, 'dien-giai'), Icon: DropletIcon },
  { match: (s) => has(s, 'thuoc-bo', 'siro-bo') || /(^|-)bo(-|$)/.test(s) || s.startsWith('bo-'), Icon: PillIcon },

  // —— Atom / lab leftovers ——
  { match: (s) => has(s, 'report', 'ho-so'), Icon: ReportMedicalIcon },
  { match: (s) => has(s, 'atom', 'phan-tu'), Icon: AtomIcon },
]

export function resolveCategoryIcon(categorySlug: string): CategoryGlyph {
  const segment = (categorySlug.split('/').pop() || categorySlug).toLowerCase()
  for (const rule of CATEGORY_ICON_RULES) {
    if (rule.match(segment)) return rule.Icon
  }
  return PackageIcon
}

/** Home quick-link icon ids. */
export type HomeQuickLinkIconId =
  | 'pill-plus'
  | 'bottle'
  | 'user'
  | 'file-text'
  | 'map-pin'
  | 'vaccine'
  | 'shield-search'

const HOME_QUICK_LINK_ICONS: Record<HomeQuickLinkIconId, CategoryGlyph> = {
  'pill-plus': PillPlusIcon,
  bottle: BottleIcon,
  user: UserIcon,
  'file-text': FileTextIcon,
  'map-pin': LocationIcon,
  vaccine: VaccineIcon,
  'shield-search': ShieldCheckIcon,
}

export function resolveHomeQuickLinkIcon(iconId: HomeQuickLinkIconId): CategoryGlyph {
  return HOME_QUICK_LINK_ICONS[iconId] ?? SearchIcon
}
