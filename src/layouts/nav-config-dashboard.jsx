import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
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
  soon: icon('ic-soon'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'GENEL BAKIŞ',
    items: [
      { title: 'Başlangıç', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Meta', path: paths.dashboard.general.ecommerce, icon: ICONS.meta },
      { title: 'Google', path: paths.dashboard.general.banking, icon: ICONS.google_ads, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      { title: 'Search Console', path: paths.dashboard.general.search_console, icon: ICONS.search_console },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'YÖNETİM',
    items: [
      {
        title: 'Organizasyon',
        path: paths.dashboard.user.root,
        icon: ICONS.organization,
        children: [
          { title: 'Hesap', path: paths.dashboard.user.account },
          { title: 'Kullanıcılar', path: paths.dashboard.user.list },
        ],
      },
      {
        title: 'Rapor',
        path: paths.dashboard.order.root,
        icon: ICONS.report,
        children: [
          { title: 'Meta', path: paths.dashboard.order.root, icon: ICONS.meta },
          { title: 'Google', path: paths.dashboard.order.demo.details, icon: ICONS.google_ads },
          { title: 'Analytics', path: paths.dashboard.order.root, icon: ICONS.analytics },
          { title: 'Search Console', path: paths.dashboard.order.demo.details, icon: ICONS.search_console },
        ],
      },
      { title: 'SEO', path: paths.dashboard.invoice.root, icon: ICONS.seo, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'Hedef Kitle', path: paths.dashboard.post.root, icon: ICONS.tagret_group, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'E-Posta', path: paths.dashboard.mail, icon: ICONS.mail, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'Sohbet', path: paths.dashboard.chat, icon: ICONS.chat, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'Takvim', path: paths.dashboard.calendar, icon: ICONS.calendar, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
      { title: 'Görevler', path: paths.dashboard.kanban, icon: ICONS.kanban, disabled: true, 
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="eva:clock-outline" />}
          >
            Yakında
          </Label>
        ) },
    ],
  },
];
