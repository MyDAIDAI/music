import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'

export function getSingerList () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParam, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
