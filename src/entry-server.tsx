import { renderToString } from 'react-dom/server'
import App from './App'
import { base, pageMeta, routes } from './content'

export { base, routes }
export function render(path: string) {
  return { html: renderToString(<App initialPath={path} />), ...pageMeta(path, 'en') }
}
