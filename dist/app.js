const express = require('express')
const axios = require('axios')

const app = express()

var apiRouter = express.Router()
apiRouter.get('/getDiscList', function(req, res) {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
app.use('/api', apiRouter)
