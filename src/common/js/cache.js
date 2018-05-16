import storge from 'good-storage'
const SEARCH_KET = '_search_'
const SEARCH_MAX_LEN = 15

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.split(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.split(index, 1)
  }
}

export function loadSearch () {
  return storge.get(SEARCH_KET, [])
}

export function clearSearch () {
  storge.remove(SEARCH_KET)
  return []
}

export function deleteSearch (query) {
  let searches = storge.get(SEARCH_KET, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storge.set(SEARCH_KET, searches)
  return searches
}
export function saveSearch (query) {
  let searches = storge.get(SEARCH_KET, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storge.set(SEARCH_KET, searches)
  return searches
}
