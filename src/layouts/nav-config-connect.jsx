import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
    connect: icon('ic-connect'),
};

// ----------------------------------------------------------------------

export const _account = [
  { label: 'Bağlan', href: paths.connect, icon: ICONS.connect },
];