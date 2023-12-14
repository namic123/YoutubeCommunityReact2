import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import Pagination from "../page/Pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchComponent } from "../page/SearchComponent";
import { Sidenav } from "./Sidenav";

function AdminMemberList(props) {
  const [memberList, setMemberList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [searchById, setSearchById] = useState("");

  const navigate = useNavigate();
  let [params] = useSearchParams();
  let location = useLocation();

  useEffect(() => {
    axios
      .post("/api/admin/member/list?" + params)
      .then((response) => {
        setMemberList(response.data.memberList);
        setPageInfo(response.data.pageInfo);
      })
      .catch(() => console.log("bad"));
  }, [location, searchById]);

  if (pageInfo == null) {
    return <Spinner />;
  }

  function handleMemberIdSearch(e) {
    const newSearchBy = e.target.value;
    setSearchById(newSearchBy);
    params.set("mid", newSearchBy);
  }

  return (
    <Flex>
      <Sidenav />
      <Box w={"80%"} ml={"3%"}>
        <Flex>
          <Heading mt={5} mb={5} mr={10}>
            회원 정보 리스트
          </Heading>
          <Input
            mt={5}
            mb={5}
            type="text"
            w={"30%"}
            placeholder="회원 ID입력"
            onChange={(e) => handleMemberIdSearch(e)}
          />
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                번호
              </Td>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                아이디
              </Td>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                등급
              </Td>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                이메일
              </Td>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                연락처
              </Td>
              <Td
                fontWeight={"bold"}
                borderColor={"black"}
                textAlign={"center"}
              >
                가입일시
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {memberList &&
              memberList.map((member) => (
                <Tr
                  key={member.member_id}
                  _hover={{ backgroundColor: "red.100" }}
                  onClick={() => navigate("/admin/member/" + member.member_id)}
                >
                  <Td textAlign={"center"}>
                    {memberList.indexOf(member) +
                      1 +
                      (params.get("p") - 1) * 20}
                  </Td>
                  <Td textAlign={"center"}>{member.member_id}</Td>
                  {member.role_name == "운영자" && (
                    <Td color={"blue"} textAlign={"center"}>
                      {member.role_name}
                    </Td>
                  )}
                  {member.role_name == "운영자" || (
                    <Td textAlign={"center"}>일반[{member.role_name}]</Td>
                  )}
                  <Td textAlign={"center"}>{member.email}</Td>
                  <Td textAlign={"center"}>{member.phone_number}</Td>
                  <Td textAlign={"center"}>{member.created_at}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Pagination pageInfo={pageInfo} />
      </Box>
    </Flex>
  );
}

export default AdminMemberList;