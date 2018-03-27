function getName () {
  for (let i = 1; i <= 100; i++) {
    let result = ''
    let d = 0
    for (let j = 0; j < arguments.length; j++) {
      if (i % arguments[j].value === 0) {
        result += arguments[j].name
        d += 1
      }
    }
    if (d === 0) {
      console.log(i)
    } else {
      result = result.split('').map(function (ele) {
        return ele.charCodeAt
      }).sort(function (a, b) {
        return a - b
      }).map(function (ele) {
        return ele.fromCharCode()
      }).join('')
      console.log(result)
    }
  }
}
getName({name: 'Fizz', value: 3}, {name: 'Buzz', value: 5}, {name: 'Zoo', value: 7})
手机端 1px
Promise