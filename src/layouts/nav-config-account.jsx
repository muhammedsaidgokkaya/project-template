import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  meta: icon('ic-meta'),
  google_ads: icon('ic-google-ads'),
  search_console: icon('ic-search-console'),
  organization: icon('ic-organization'),
  report: icon('ic-report'),
  seo: icon('ic-seo'),
  tagret_group: icon('ic-target-group'),
  users: icon('ic-users'),
};

// ----------------------------------------------------------------------

export const _account = [
  { label: 'Başlangıç', href: paths.dashboard.root, icon: ICONS.dashboard },
  { label: 'Hesap', href: paths.dashboard.user.account, icon: ICONS.user },
  { label: 'Kullanıcılar', href: paths.dashboard.user.list, icon: ICONS.users },
];
