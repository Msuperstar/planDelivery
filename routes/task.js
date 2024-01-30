var mysql = require("mysql2");

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  //안되면 newuser
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})
//process.env.

conn.connect();
//conn.query("요청 쿼리문",콜백 함수)

const ejs = require('ejs');
var router = require('express').Router();

// app.js 또는 서버 진입 파일

router.post('/save/task', (req, res) => {
  // 클라이언트에서 전송된 데이터
  const title = req.body.title;
  const place = req.body.place;
  const duration = req.body.duration;
  const userid = req.body.userid
  
  console.log("user이름:"+userid)

  // MySQL에 데이터 삽입 쿼리
  const query = 'INSERT INTO task (TaskName, TaskDate, TaskDuration, AccountId,TaskPlace) VALUES (?, ?, ?,?, ?)';
  conn.query(query, [title, new Date(), duration, userid, place], (err, result) => {
    if (err) {
      console.error('쿼리 실행 중 오류:', err.stack);
      return res.status(500).send('Internal Server Error');
    }

    console.log('데이터 삽입 성공');
    res.redirect("/home");
  });
});

module.exports = router;
