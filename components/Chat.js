import styled from "styled-components";
import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getFriendData from "../utils/getFriendData";
import Link from "next/link";

dayjs.extend(localizedFormat)



const Chat = ({
    id,
    users,
    timestamp='',
    latestMessage=''
}) => {
    useEffect(() => {
        if (users.length > 0) {
            getFriendData(users).then(data => {
                setFriend(data)
            })
        }
    },[])
    const [friend, setFriend] = useState({})
  return (
      <Link href={`/chat/${id}`}>
            <a>
                <Container>
                    <FrdAvatar src={friend.photoUrl} />
                    <ChatContainer>
                        <div style={{gridArea:'name'}}>{friend.displayName}</div>
                        <div style={{gridArea:'latest_message', color:'#939393', fontSize:14}}>{latestMessage}</div>
                        <div style={{ gridArea: 'time', color:'#939393', fontSize:14}}>{dayjs(timestamp * 1000).format('LT') ?? '' }</div>
                    </ChatContainer>
                </Container>
            </a>
        </Link>
  )
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    min-height: 67px;
    padding-left: 15px;
    word-break: break-word;
    :hover {
        background-color: #f5f5f5;
    }
    `

const FrdAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
    `

const ChatContainer = styled.div`
    display: grid;
    padding: 10px;
    width: 100%;
    grid-template-columns: repeat(3 1fr);
    border-bottom: 1px solid #ededed;
    gap: 10px;
    grid-template-areas: "name name time" "latest_message latest_message.";
`