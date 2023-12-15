// VoteLoading.js
import React, { useState, useEffect } from "react";
import "../css/voteLoading.css";
import { Center } from "@chakra-ui/react";

function VoteLoading({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5초 후에 로딩 상태를 false로 변경

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Center>
        <div className="vote-symbol"></div>
      </Center>
    );
  }

  return <>{children}</>;
}

export default VoteLoading;