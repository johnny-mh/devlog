import { PLUGIN_NAME } from './index'

export function log(
  msg: string,
  type: 'success' | 'warn' | 'error' = 'success'
) {
  if (type === 'success') {
    console.log(`%s${PLUGIN_NAME}:%s ${msg}`, '\x1b[32m', '\x1b[0m')

    return
  }

  if (type === 'warn') {
    console.log(`%s${PLUGIN_NAME}:%s ${msg}`, '\x1b[33m', '\x1b[0m')

    return
  }

  console.log(`%s${PLUGIN_NAME}:%s Failed!\n${msg}`, '\x1b[31m', '\x1b[0m')
}
