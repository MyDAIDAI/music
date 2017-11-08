import originJSOP from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') > 1 ? '&' : '?') + param(data)

  return new Promise((resolve, reject) => {
    originJSOP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  // substring从返回从第一个位置开始，到字符串结尾
  return url ? url.substring(1) : ''
}
