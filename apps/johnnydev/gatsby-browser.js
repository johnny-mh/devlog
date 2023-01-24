import { AppProvider } from './src/context/app'
import './src/styles/highlight.scss'
import './src/styles/markdown-content.scss'
import './src/styles/prism-vscodedark.scss'
import './src/styles/reset.scss'
import './src/styles/site.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')
dayjs.extend(require('dayjs/plugin/localizedFormat'))

export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>
}

// export const onRouteUpdate = (loc) => {}

// export const shouldUpdateScroll = ({ routerProps }) => {
//   const { disableScrollUpdate } = routerProps.location.state
//   return !disableScrollUpdate
// }
