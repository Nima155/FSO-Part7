const app = require("./app")
const http = require("http")
const { PORT } = require("./utils/config")
const server = http.createServer(app)
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`)
// })
// reason as to why we dont use app.listen => https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
server.listen(PORT, console.log(`Server running on port ${PORT}`))
