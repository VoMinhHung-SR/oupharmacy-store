import type { ComponentType } from 'react'
import { EyeIcon, LocationIcon, UserIcon } from './account'
import { PackageIcon } from './commerce'
import {
  ActivityIcon,
  BodyScanIcon,
  BoneIcon,
  BrainIcon,
  DnaIcon,
  DropletIcon,
  EarIcon,
  HeartIcon,
  HeartbeatIcon,
  LungsIcon,
  MedicalCrossIcon,
  PlantIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  VirusIcon,
} from './medical'
import {
  BandageIcon,
  BottleIcon,
  FirstAidKitIcon,
  MilkIcon,
  PerfumeIcon,
  PillIcon,
  PillPlusIcon,
  SprayIcon,
  VaccineIcon,
} from './pharmacy'
import { FileTextIcon, SearchIcon } from './ui'
import type { SvgIconProps } from './types'

type CategoryGlyph = ComponentType<SvgIconProps>

/**
 * Ordered keyword → icon rules (first match wins).
 * Keywords are matched against the last slug segment (lowercase).
 */
const CATEGORY_ICON_RULES: Array<{ match: (slug: string) => boolean; Icon: CategoryGlyph }> = [
  { match: (s) => s.includes('tim-mach') || s.includes('huyet-ap') || s.includes('mau'), Icon: HeartbeatIcon },
  { match: (s) => s.includes('tieu-hoa') || s.includes('gan-mat'), Icon: BodyScanIcon },
  { match: (s) => s.includes('ho-hap'), Icon: LungsIcon },
  { match: (s) => s.includes('than-kinh'), Icon: BrainIcon },
  {
    match: (s) =>
      s.includes('vitamin') || s.includes('bo-sung') || s.includes('thuc-pham') || s.includes('khoang-chat'),
    Icon: BottleIcon,
  },
  {
    match: (s) => s.includes('de-khang') || s.includes('mien-dich'),
    Icon: ShieldCheckIcon,
  },
  {
    match: (s) => s.includes('sinh-ly') || s.includes('noi-tiet'),
    Icon: MedicalCrossIcon,
  },
  { match: (s) => s.includes('dinh-duong'), Icon: PlantIcon },
  { match: (s) => s.includes('dieu-tri'), Icon: FirstAidKitIcon },
  {
    match: (s) => s.includes('lan-da') || s.includes('da-lieu'),
    Icon: DropletIcon,
  },
  { match: (s) => s.includes('lam-dep') || s.includes('my-pham') || s.includes('trang-diem'), Icon: PerfumeIcon },
  { match: (s) => s.includes('tinh-duc'), Icon: HeartIcon },
  { match: (s) => s.includes('sua') || s.includes('baby'), Icon: MilkIcon },
  {
    match: (s) => s.includes('dung-cu') || s.includes('theo-doi') || s.includes('stethoscope'),
    Icon: StethoscopeIcon,
  },
  { match: (s) => s.includes('tai'), Icon: EarIcon },
  { match: (s) => s.includes('mat') || s.includes('mui') || s.includes('hong'), Icon: EyeIcon },
  { match: (s) => s.includes('co-xuong-khop'), Icon: BoneIcon },
  {
    match: (s) => s.includes('giam-dau') || s.includes('ha-sot') || s.includes('khang-viem'),
    Icon: PillIcon,
  },
  { match: (s) => s.includes('khang-sinh') || s.includes('khang-nam'), Icon: VirusIcon },
  { match: (s) => s.includes('tieu-duong'), Icon: ActivityIcon },
  { match: (s) => s.includes('tiet-nieu') || s.includes('sinh-duc'), Icon: DropletIcon },
  { match: (s) => s.includes('ung-thu'), Icon: DnaIcon },
  { match: (s) => s.includes('dich-ung'), Icon: PlantIcon },
  { match: (s) => s.includes('tiem-chich') || s.includes('dich-truyen') || s.includes('vac-xin'), Icon: VaccineIcon },
  { match: (s) => s.includes('mieng-dan') || s.includes('cao-xoa'), Icon: BandageIcon },
  {
    match: (s) => s.includes('cham-soc-da') || s.includes('cham-soc-co-the') || s.includes('da-mat'),
    Icon: SprayIcon,
  },
  { match: (s) => s.includes('cham-soc-toc') || s.includes('da-dau'), Icon: ScissorsIcon },
  // Broad “bo” after specific rules (avoid matching random segments)
  { match: (s) => /(^|-)bo(-|$)/.test(s) || s.startsWith('bo-'), Icon: PillIcon },
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
