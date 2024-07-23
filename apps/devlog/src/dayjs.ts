/* eslint-disable perfectionist/sort-imports */
import _dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/ko'

_dayjs.extend(customParseFormat)
_dayjs.extend(duration)
_dayjs.extend(relativeTime)

export const dayjs = _dayjs
