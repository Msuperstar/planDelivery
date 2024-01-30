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

router.post('/save/event', (req, res) => {
  // 클라이언트에서 전송된 데이터
  const title = req.body.title;
  const userid = req.body.userid
  console.log("title:"+title)
  var currentDate = new Date();
  var formattedDate = currentDate.toLocaleDateString()
  console.log("event db에 저장된는 아이디 이름\n"+userid)

  // MySQL에 데이터 삽입 쿼리
  const query = 'INSERT INTO event (EventName, EventIsCompleted, EventDate, AccountId) VALUES (?, ?, ?, ?)';
  conn.query(query, [title, 0, new Date(), userid], (err, result) => {
    if (err) {
      console.error('쿼리 실행 중 오류:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    console.log('event 데이터 삽입 성공'); 
    
  });
  res.render('home.ejs',{user: userid, currentDate:formattedDate ,})//toggle_opened :true})
});

module.exports = router;
//결과값을 반환하겠다(왜냐면 server에 있지 않으니까)

