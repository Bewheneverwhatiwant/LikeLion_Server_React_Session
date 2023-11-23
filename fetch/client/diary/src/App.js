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
    const timestamp = new Date().toISOString(); // 현재 날짜와 시간
    axios.post("http://localhost:4000/api/diary", { title, content, timestamp }) // URL 수정
      .then(() => {
        fetchDiaries(); // 목록 새로고침
      });
  };

  return (
    <>
      <Container>
        <Title>일기를 써봅시다!</Title>
        <Form onSubmit={onSubmitHandler}>
          <Input name="title" placeholder="제목" />
          <TextArea name="content" placeholder="내용" />
          <SubmitButton type="submit">추가</SubmitButton>
        </Form>
        {diaryList && (
          <DiaryList>
            {diaryList.map((diary) => (
              <DiaryItem key={diary.id}>
                <div>
                  <DiaryTitle>{diary.title}</DiaryTitle>
                  <DiaryContent>{diary.content}</DiaryContent>
                  <DiaryContent>{diary.timestamp}</DiaryContent>
                </div>
                <DeleteButton onClick={() => handleDelete(diary.id)}>삭제</DeleteButton> {/* 삭제 버튼 추가 */}
              </DiaryItem>
            ))}
          </DiaryList>
        )}
      </Container>
    </>
  );
}

export default App;