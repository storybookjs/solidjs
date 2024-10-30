import { SolidLogo } from '../SolidLogo';
import { StorybookLogo } from '../StorybookLogo';

import plusIcon from './plus.svg';

export function Logos() {
  return (
    <div class="flex justify-center items-center">
      <SolidLogo />
      <img src={plusIcon} class="h-36 mr-6" />
      <StorybookLogo />
    </div>
  );
}
