import dayjs from 'dayjs';
import React from 'react'
import styled from 'styled-components';
import { useAuth } from '../Auth';

const Message = ({user, message, timestamp}) => {
    const { currentUser } = useAuth()
    const loginMail = currentUser.email
    const MessageType = user === loginMail? myMessage: FrdMessage;
  return (
    <Container>
        {
            (user !== loginMail) && <MessageTail></MessageTail>
        }
        <MessageType>
            {message}
            <TimeStamp>{
                dayjs(timestamp).format('LT')
            }
            </TimeStamp>
        </MessageType>
    </Container>
  )
}

export default Message;

const Container = styled.div`
    display: flex;
`

const MessageBubble = styled.div`
    padding: 15px;
    padding-bottom: 26px;
    text-align: right;
    background-color: white;
    margin-bottom: 10px;
    position: relative;
`

const myMessage = styled(MessageBubble)`
    margin-left: auto;
    background-color: #dcf8c6;
    border-radius: 8px 0 8px 8px;
`
const FrdMessage = styled(MessageBubble)`
    background-color: #fff;
    border-radius: 0 8px 8px 8px;
    text-align: left;
`

const MessageTail = styled.span`
    margin-top: -4px;
`

const TimeStamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`