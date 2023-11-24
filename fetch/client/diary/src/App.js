import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "styled-components";

const Container = styled.div`
display: flex;
width: 100vw;
justify-content: center;
align-items: center;
flex-direction: column;
margin-top: 30px;
`;

const Title = styled.p`
font-size: 24px;
font-weight: bold;
margin-bottom: 20px;
`;

const Form = styled.form`
width: 60%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
margin-bottom: 20px;
`;

const Input = styled.input`
width: 100%;
padding: 10px;
margin-bottom: 10px;
font-size: 16px;
`;

const TextArea = styled.textarea`
width: 100%;
padding: 10px;
margin-bottom: 10px;
font-size: 16px;
`;

const SubmitButton = styled.button`
padding: 10px;
width: 50%;
background-color: #4caf50;
color: white;
border: none;
cursor: pointer;

&:hover {
  background-color: #45a049;
}
`;

const DeleteButton = styled.button`
padding: 10px;
margin: 10px;
width: 50px;
background-color: #ff0000;
color: white;
border: none;
cursor: pointer;

&:hover {
  background-color: #45a049;
}
`;

const DiaryList = styled.ul`
list-style: none;
width: 60%;
box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
`;

const DiaryItem = styled.li`
border-bottom: 1px solid #eee;
padding: 20px 0;
display: flex;
justify-content: space-between;
align-items: center;
`;

const DiaryTitle = styled.h3`
font-size: 18px;
margin-bottom: 10px;
`;

const DiaryContent = styled.p`
font-size: 16px;
color: #555;
`;

const Emotion = styled.span`
  margin-right: 10px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;


function App() {
  const [diaryList, setDiaryList] = useState([]); // 상태 이름 변경

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/diary");
      setDiaryList(response.data); // 상태 업데이트 함수 변경
    } catch (error) {
      console.error("일기 목록을 불러오는 데 실패했습니다.", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/diary/${id}`);
      if (response.status === 200) {
        const updatedDiaries = diaryList.filter(diary => diary.id !== id);
        setDiaryList(updatedDiaries);
      } else {
        console.error('일기 삭제 실패');
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const emotions = [];
    if (isJoyful) emotions.push('기쁨');
    if (isSad) emotions.push('슬픔');
    if (isAngry) emotions.push('화남');

    const timestamp = new Date().toISOString(); //날짜와 시간
    axios.post("http://localhost:4000/api/diary", { title, content, emotions, timestamp })
      .then(() => {
        fetchDiaries(); // 목록 새로고침
        setIsJoyful(false); // 체크박스 상태 초기화
        setIsSad(false);
        setIsAngry(false);
      });
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  }

  const [isJoyful, setIsJoyful] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const [isAngry, setIsAngry] = useState(false);

  return (
    <>
      <Container>
        <Title>일기를 써봅시다!</Title>
        <Form onSubmit={onSubmitHandler}>
          <Input name="title" placeholder="제목" />
          <TextArea name="content" placeholder="내용" />
          <div>
            <input type="checkbox" id="joyful" checked={isJoyful} onChange={(e) => setIsJoyful(e.target.checked)} />
            <label htmlFor="joyful">기쁨</label>
          </div>
          <div>
            <input type="checkbox" id="sad" checked={isSad} onChange={(e) => setIsSad(e.target.checked)} />
            <label htmlFor="sad">슬픔</label>
          </div>
          <div>
            <input type="checkbox" id="angry" checked={isAngry} onChange={(e) => setIsAngry(e.target.checked)} />
            <label htmlFor="angry">화남</label>
          </div>
          <SubmitButton type="submit">추가</SubmitButton>
        </Form>
        {diaryList && (
          <DiaryList>
            {diaryList.map((diary) => (
              <DiaryItem key={diary.id}>
                <div>
                  <DiaryTitle>{diary.title}</DiaryTitle>
                  <DiaryContent>{diary.content}</DiaryContent>
                  <DiaryContent>{formatDate(diary.timestamp)}</DiaryContent>
                  {diary.emotions && diary.emotions.map((emotion, index) => (
                    <Emotion key={index}>{emotion}</Emotion>
                  ))}
                </div>
                <DeleteButton onClick={() => handleDelete(diary.id)}>삭제</DeleteButton>
              </DiaryItem>
            ))}
          </DiaryList>
        )}
      </Container>
    </>
  );
}

export default App;