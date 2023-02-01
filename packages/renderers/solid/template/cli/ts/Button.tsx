import { Component, JSX } from 'solid-js';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: Component<ButtonProps> = (props) => {
  return <button {...props}/>
}