//설치한것(npm)
//nodemon, express,body-parser(morgan), dotenv,ejs,mysql2
//cookie-parser, express, express ejs(동적 html만들때)
//sha,passport, passport-local, passport-google-oauth20, kakao
//express-useragnet
//touch인식:hammerjs, 드래그앤 드롭:dragula, css애니메이션: animejs


const dotenv = require('dotenv').config();

const mysql = require("mysql2");  
const useragent = require('express-useragent');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  //안되면 newuser
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

// 연결
conn.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

const express = require('express');
const app = express();//앱 객체를 서버의 기능을 하나씩 만들면됨
const cryptoJs = require("crypto-js"); //sha256역할

app.listen(process.env.PORT || 8080, function(){
    console.log("서버가 시작되었습니다. 포트: 8080");
});

//body-parser라이브러리 추가
const bodyParser = require('body-parser'); //객체 생성
//const db = require('node-mysql/lib/db'); //이거 확인 필요
app.use(bodyParser.urlencoded({extended:true})); //false로도 한번 바꿔보던가
app.set('view engine','ejs'); 
app.use('/public', express.static('public'));
const ejs = require('ejs');

app.use('/',require('./routes/event.js'))
app.use('/',require('./routes/auth.js'))
app.use('/',require('./routes/task.js')) //변경필요

/*app.get('/', (req, res) => {
     res.render('login.ejs', { isMobile });
});*/ 

/*
app.get('/', (req, res) => {
    const isMobile = req.useragent.isMobile;

    // 모바일이면 모바일 템플릿을 렌더링
    if (isMobile) {
        res.render('login.ejs', { isMobile });
    } else {
        // 모바일이 아니면 데스크탑 템플릿을 렌더링
        res.render('index.ejs', { isMobile });
    }
});*/ //데스크탑으로 모바일 화면 작업 종료되면 화면 적용 실시



// 사용자가 로그인 상태인지 확인하는 미들웨어
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login-social');
  }

// fetchDataFromDatabase 함수 내에서의 SQL 쿼리 예시
function fetchDataFromDatabase(userid) {
  const query = 'SELECT * FROM event WHERE AccountId = ?';
  
  // 실제로는 MySQL 쿼리를 실행하고 결과를 반환하는 로직이 들어가야 합니다.
  // 아래는 MySQL 라이브러리를 사용하는 예시 코드입니다.
  // 실제로 사용 중인 라이브러리에 따라 코드가 달라질 수 있습니다.

  const result = conn.query(query, [userid], (err, result) => {
    if (err) {
      console.error('쿼리 실행 중 오류:', err.stack);
      return []; // 오류 발생 시 빈 배열을 반환하거나 적절한 오류 처리를 수행할 수 있습니다.
    }

    // 데이터를 반환합니다.
    return result;
  });

  // 결과 반환
  return result;
}



app.get('/', (req, res) => {
    console.log("데스크탑 홈화면 접속");
    
    // 사용자가 인증되어 있는지 확인
    const user = req.user ? req.user.userid : null;
    console.log("user"+user)
    res.render('index.ejs', { user });
});


/*app.get('/home',isAuthenticated, (req, res) => {
    console.log("모바일 홈화면 접속")
    console.log("home접속을 위해 로그인 필요")
    console.log("req.user.userid:"+req.user.userid)
    res.render('home.ejs',{ user: req.user.userid });
});*/
// 서버 측 코드

app.get('/home', isAuthenticated, (req, res) => {
    console.log("모바일 홈화면 접속");
    console.log("home 접속을 위해 로그인 필요");
    console.log("req.user.userid: " + req.user.userid);
  
    const today = new Date();
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      weekday: 'long' 
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    console.log(formattedDate);
    res.render('home.ejs', { user: req.user.userid, currentDate: formattedDate, toggle_opened:false });
});
  

app.get('/settings',isAuthenticated, (req, res) => {
    console.log("세팅화면 접속")
    console.log("req.user.userid:"+req.user.userid)
    res.render('settings.ejs',{ user: req.user.userid });
});

app.get('/calender',isAuthenticated, (req, res) => {
    console.log("캘린더 화면 접속")
    console.log("req.user.userid:"+req.user.userid)
    res.render('calender.ejs',{ user: req.user.userid });
});

app.get('/schedule',isAuthenticated, (req, res) => {
    console.log("캘린더 화면 접속")
    console.log("req.user.userid:"+req.user.userid)
    res.render('schedule.ejs',{ user: req.user.userid });
});

app.get('/signup',isAuthenticated, (req, res) => {
    console.log("회원가입 페이지")
    console.log("req.user.userid:"+req.user.userid)
    res.render('signup.ejs',{ user: req.user.userid });
});

  app.get('/load-event', isAuthenticated, (req, res) => {
    console.log("load-event" + req.user.userid);

    // 사용자 ID와 일치하는 이벤트를 데이터베이스에서 가져오는 쿼리
    const query = 'SELECT EventName FROM event WHERE AccountId = ?';
    conn.query(query, [req.user.userid], (err, results) => {
        if (err) {
            console.error('쿼리 실행 중 오류:', err.stack);
            return res.status(500).send('Internal Server Error');
        }
        console.log(req.user.userid)
        console.log(results)

        // 결과를 렌더링할 템플릿에 전달
        res.render('event.ejs', { user: req.user.userid, events: results }, (err, html) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(html);
            }
        });
    });
});

app.get('/load-task', isAuthenticated ,(req, res) => {
    console.log("load-task"+req.user.userid)
    // task.ejs 파일을 렌더링하여 클라이언트에 전송
    ejs.renderFile('views/task.ejs', { user: req.user.userid }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(html);
      }    
    });
});

