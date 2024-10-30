import storybookLogo from './storybook-logo.svg';

export function StorybookLogo() {
  return (
    <img
      src={storybookLogo}
      class="h-72 pointer-events-none"
      alt="Storybook logo"
    />
  );
}
