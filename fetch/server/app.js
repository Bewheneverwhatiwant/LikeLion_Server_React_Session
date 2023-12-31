// server/app.js

const express = require("express");
const cors = require("cors"); // cors 모듈 임포트
const app = express();
app.use(cors()); // CORS 사용

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let id = 2;
const diaryList = [
    {
        id: 1,
        title: "오늘은 리액트 세션~",
        content: "리액트는 왜 이렇게 재밌을까?",
        timestamp: new Date().toISOString(), // 현재 날짜와 시간 추가
        emotions: ['기쁨', '슬픔', '화남']
    },
];

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/diary", function (req, res) {
    res.json(diaryList);
});

app.post("/api/diary", (req, res) => {
    const { title, content, emotions, timestamp } = req.body;
    diaryList.push({
        id: id++,
        title,
        content,
        emotions, // emotions 필드에 배열 저장
        timestamp
    });
    return res.send("success");
});

// server/app.js

app.delete("/api/diary/:id", (req, res) => {
    const targetId = parseInt(req.params.id);
    const index = diaryList.findIndex((diary) => diary.id === targetId);

    if (index !== -1) {
        diaryList.splice(index, 1);
        return res.send("success");
    } else {
        return res.status(404).send("Not Found");
    }
});

app.listen(4000, () => {
    console.log("server start!");
});