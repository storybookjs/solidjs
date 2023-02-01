import { global as globalThis } from '@storybook/global';

import { Button } from './Button';

globalThis.Components = { Button };
globalThis.storybookRenderer = 'solid';
