import { Avatar, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search'
import MoreVert from '@mui/icons-material/MoreVert'
import { AttachFile,InsertEmoticon, Mic } from '@mui/icons-material';
import Message from './Message';
import getFriendData from '../utils/getFriendData';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../Auth';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


// const messages = [
//     {
//         id: "d2cbdasdasd",
//         message:"Hello Djamel",
//         user:'moetaz@cleverzone.io',
//         photoUrl:'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=272',
//         timestamp: 1648032922945
//     },
//     {
//         id: "d2cbdasdasa",
//         message:"Hello Moataz",
//         user:'djamel@cleverzone.io',
//         photoUrl:'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=272',
//         timestamp: 1648032929945
//     }
// ]
const ChatContent = ({chat, chatId, messagesProps}) => {
    const [friend, setFriend] = useState({})
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)
    const {currentUser} = useAuth();
    const chatParse = JSON.parse(chat)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }
    useEffect(() => {
        scrollToBottom();
    },[messages])
    
    useEffect(() => {
        JSON.parse(messagesProps);
    },[])

    useEffect(() => {
        const messagesRef = collection(db,'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp','asc'));
        const unsubscribe = onSnapshot(q, (qurySnapshot) => {
            setMessages(qurySnapshot.docs.map(doc => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()})))
        })
        return unsubscribe
    },[chatId])

    useEffect(() => {
        if(chatParse?.users?.length > 0) {
            getFriendData(chatParse.users).then(data => {
                setFriend(data)
            })
        } else {
            console.log("No friends in this chat");
        }
    }, [chatId])
    
    const sendMessage = async (e) => {
        e.preventDefault();
        const usersRef = doc(db, 'users',currentUser.uid)
        setDoc(usersRef, {
            lastSeen: serverTimestamp()}, {merge: true}
        )
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            timestamp: serverTimestamp(),
            messages: input,
            user: currentUser.email,
        })

        const chatRef = doc(db, 'chats', chatId);
        setDoc(chatRef , {
            latesMessage: input,
            timestamp: serverTimestamp(),
        }, {
            merge: true
        });
        setInput('')
    }
  return (
    <Container>
        <Header>
            <Avatar src={friend.photoUrl}/>
            <HeaderInfo>
                <h3>{friend.displayName}</h3>
                <div>Last Active: {dayjs(friend.lastSeen?.toDate()).fromNow()}</div>
            </HeaderInfo>
            <IconButton>
                <SearchIcon />
            </IconButton>
            <IconButton>
                <MoreVert />
            </IconButton>
        </Header>
        <MessagesContainer>
            {
                messages.map((message) => <Message key={message.id} message={message.messages} user={message.user} timestamp={message.timestamp} />)
            }
            <div style={{ marginBottom: 1}} ref={messagesEndRef}></div>
        </MessagesContainer>
        <InputContainer>
            <IconButton>
                <InsertEmoticon />
            </IconButton>
            <IconButton>
                <AttachFile />
            </IconButton>
            <Input placeholder='Type a message' value={input} onChange={e => setInput(e.target.value)}/>
            <button hidden disabled={!input} onClick={sendMessage}>sendMessage</button>
            <IconButton>
                <Mic />
            </IconButton>
        </InputContainer>
    </Container>
  )
}

export default ChatContent

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    width: 100%;
`

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;
    >h3 {
        margin-bottom: 3px;
    }

    >div {
        font-size: 14px;
        color: gray;
    }
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #f0f0f0;
    z-index: 99;
`

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`

const MessagesContainer = styled.div`
    padding: 20px;
    background-color: #e5ded8;
    flex: 1;
    background-attachment: fixed;
    background-repeat: repeat;
`