import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Filednd } from "../file/Filednd";
import Editor from "../component/Editor";
import { DetectLoginContext } from "../component/LoginProvider";

function BoardWrite() {
  /* 로그인 정보 컨텍스트 */
  const { token, handleLogout, loginInfo, validateToken } =
    useContext(DetectLoginContext);

  /* use state */
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uuid, setUuid] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const location = useLocation();
  const boardInfo = location.state;

  /* use navigate */
  let navigate = useNavigate();

  /* use toast */
  const toast = useToast();

  // 비로그인 상태로 글쓰기 경로 직접 접근시 경고 발생 후 로그인페이지로 이동
  useEffect(() => {
    if (loginInfo == null) {
      if (!token.detectLogin) {
        window.alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/member/login");
      }
    }
    console.log(boardInfo);
  }, [loginInfo]);

  // useEffect를 사용하여 titleError가 변경(에러발생)될 때마다 스크롤이 제목 라벨으로 이동
  useEffect(() => {
    // 동시에 발생했을 경우에는 title로 먼저 스크롤 된다.
    if (titleError && contentError) {
      const errorElement = document.getElementById("title");
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      if (titleError) {
        // 오류 메시지가 있을 때 해당 영역으로 스크롤 이동
        const errorElement = document.getElementById("title");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (contentError) {
        const errorElement = document.getElementById("content");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [titleError, contentError]);

  // title, content 의 문자열 길이가 0 이상일 경우 titleError 초기화 (타이핑 하는 순간 즉시)
  useEffect(() => {
    if (title.trim().length > 0) {
      setTitleError("");
    }

    if (content.trim().length > 0) {
      setContentError("");
    }
  }, [title, content]);

  // 작성 완료 버튼 클릭 ---------------------------------------------------
  function handleSubmit() {
    let uuSrc = getSrc();

    console.log("저장 버튼 클릭됨");

    // 제목이 null이거나 공백일 경우 에러메시지 세팅 후 반환
    if (!title || title.trim() === "") {
      console.log("제목을 입력해주세요. title은 null이거나 공백이면 안 됨.");
      setTitleError("제목을 입력해주세요. title은 null이거나 공백이면 안 됨.");
      return;
    }
    // 본문이 null이거나 공백일 경우 에러메시지 세팅 후 반환
    if (!content || content.trim() === "") {
      console.log("본문을 입력해주세요. 본문은 null이거나 공백이면 안 됨.");
      setContentError("본문을 입력해주세요. 본문은 null이거나 공백이면 안 됨.");
      return;
    }

    axios
      .postForm("/api/board/add", {
        title,
        link,
        content,
        uploadFiles,
        uuSrc,
        board_member_id: loginInfo.member_id,
      })
      .then(() => {
        toast({
          description: "게시글 저장에 성공했습니다.",
          status: "success",
        });
        navigate("/board/list");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description:
              "게시글 유효성 검증에 실패했습니다. 양식에 맞게 작성해주세요.",
            status: "error",
          });
          return;
        }

        if (error.response.status === 401) {
          toast({
            description: "권한 정보가 없습니다.",
            status: "error",
          });
          return;
        }

        if (error.response) {
          toast({
            description: "게시글 저장에 실패했습니다.",
            status: "error",
          });
          return;
        }

        console.log("error");
      })
      .finally(() => console.log("게시글 저장 끝"));
  }

  // 본문 영역 이미지 소스 코드 얻어오기
  function getSrc() {
    let imgSrc = document.getElementsByTagName("img");
    let arrSrc = [];

    for (let i = 0; i < imgSrc.length; i++) {
      if (
        imgSrc[i].src.length > 0 &&
        imgSrc[i].src.startsWith(
          "https://mybucketcontainer1133557799.s3.ap-northeast-2.amazonaws.com/fileserver/",
        )
      ) {
        arrSrc.push(imgSrc[i].src.substring(79, 115));
      }
    }

    return arrSrc;
  }

  return (
    <Box border={"2px solid black"} m={5}>
      <Heading mb={5}>유튜브 추천 :: 새 글 작성하기</Heading>

      {/* -------------------- 제목 -------------------- */}
      <FormControl mb={2} isInvalid={titleError}>
        <FormLabel id="title">제목</FormLabel>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="추천 게시글의 제목을 입력해주세요."
        />
        {/* isInvalid로 타이틀이 공백이거나 null일 경우 에러메시지 출력 */}
        <FormErrorMessage>{titleError}</FormErrorMessage>
      </FormControl>

      {/* -------------------- 링크 -------------------- */}
      <FormControl mb={2}>
        <FormLabel>링크</FormLabel>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="추천 영상의 링크를 입력해주세요."
        />
      </FormControl>

      {/* -------------------- 본문 -------------------- */}
      <FormControl mb={2} isInvalid={contentError}>
        <FormLabel id="content">본문</FormLabel>
        {/* CKEditor 본문 영역 */}
        <Editor setUuid={setUuid} uuid={uuid} setContent1={setContent} />
        <FormErrorMessage>{contentError}</FormErrorMessage>
      </FormControl>

      {/* -------------------- 파일 첨부 -------------------- */}
      <Filednd setUploadFiles={setUploadFiles} uploadFiles={uploadFiles} />

      {/* -------------------- 버튼 섹션 -------------------- */}
      {/* 저장 버튼 */}
      <Button onClick={handleSubmit} colorScheme="blue">
        작성 완료
      </Button>

      {/* 취소 버튼 */}
      <Button onClick={() => navigate("/board/list")} colorScheme="red">
        취소
      </Button>
    </Box>
  );
}

export default BoardWrite;
