import { Decorator } from "./public-types";

export const parameters = { renderer: 'solid' };
export { render } from "./render";
export { renderToCanvas } from "./renderToCanvas";

export const decorators: Decorator[] = [
    (Story, context) => {
        return <Story {...context.args} />;
    }
];
