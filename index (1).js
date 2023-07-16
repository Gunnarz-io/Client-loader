const version = '1.7.0'
const fs = require('fs')
const http = require('http')
const password = process.env['password']

http.createServer(function(req, res) {
    var pass = decodeURIComponent(req.url.split("=")[1])
    var url = req.url.split("?")[0]
    if (url.includes("dev") && pass != password) {
        res.writeHead(200)
        res.end(`
          function onLoad() {
            clearInterval(load)
            loadingText.innerHTML = "Failed to load: wrong password."
            loadingText.style.color = "#FE2836"
          }
        `)
        return
    }
    fs.readFile(`./${version}${url.includes("dev") ? '.dev' : ''}.js`, function(err, data) {
        if (err) {
            res.writeHead(404)
            res.end(JSON.stringify(err))
            return
        }
        res.writeHead(200)
        if (url.includes("dev")) {
            res.end(data)
        } else {
            res.end(`(()=>{${data};setInterval(()=>{debugger},100)})()`)
        }
    })
}).listen(8080)