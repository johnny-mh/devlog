import _dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

_dayjs.extend(duration)
_dayjs.extend(relativeTime)

export const dayjs = _dayjs
