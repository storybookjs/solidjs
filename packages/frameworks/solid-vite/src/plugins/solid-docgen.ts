import { PluginOption } from 'vite';
import MagicString from 'magic-string';

export function solidDocgen(): PluginOption {
  const cwd = process.cwd();

  return {
    enforce: 'pre',
    name: 'solid-docgen-plugin',
    async transform(src: string, id: string, options) {
      if (id.match(/(node_modules|\.stories\.)/gi)) return undefined;

      //Solid Docgen will be only generated for tsx, jsx files.
      if (id.match(/\.(tsx|jsx)$/)) {
        const s = new MagicString(src);

        //TODO: needs more research if a solid doc generator is needed for extracting args descriptions.

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true, source: id }),
        };
      }
    },
  };
}
