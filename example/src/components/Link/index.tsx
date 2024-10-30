import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import './index.css';

export type LinkProps = {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Primary UI component for user interaction
 */
export const Link: Component<LinkProps> = (props) => {
  props = mergeProps({ size: 'small' as LinkProps['size'] }, props);
  const [local, rest] = splitProps(props, [
    'primary',
    'size',
    'backgroundColor',
  ]);

  return (
    <a
      {...rest}
      classList={{
        'storybook-link--small': local.size === 'small',
        'storybook-link--medium': local.size === 'medium',
        'storybook-link--large': local.size === 'large',
        'storybook-link': true,
        'storybook-link--primary': local.primary === true,
        'storybook-link--secondary': local.primary === false,
      }}
      style={{ 'background-color': local.backgroundColor }}
    />
  );
};
