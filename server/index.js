import expresss from "express"

const app = expresss
app.get("/", (req, res) => {
  res.send("首頁")
})

app.listen(3005, () => { })