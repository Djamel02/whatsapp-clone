import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import ChatContent from '../../components/ChatContent';
import { db } from '../../firebase';

const ChatBox = () => {
    const router = useRouter()
    let docSnap = [];
    let messages = []
    useEffect(async() => {
        const messagesRef = collection(db,'chats', router.query?.id, 'messages')
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        messages = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()}))

        const docRef = doc(db,'chats',router.query.id)
        docSnap = (await getDoc(docRef)).data()
    }, [router.query?.id])
  return (
    <Container>
        <ChatContainer>
            <ChatContent chat={JSON.stringify(docSnap)} chatId={router.query?.id} messagesProps={JSON.stringify(messages)} />
        </ChatContainer>
    </Container>
  )
}

export default ChatBox

// export async function getServerSideProps(ctx) {
//     const messagesRef = collection(db,'chats', ctx.query.id, 'messages')
//     const q = query(messagesRef, orderBy('timestamp', 'asc'));
//     const querySnapshot = await getDocs(q);
//     const messages = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()}))

//     const docRef = doc(db,'chats',ctx.query.id)
//     const docSnap = await getDoc(docRef)
//     return {
//         props: {
//             chat: JSON.stringify(docSnap.data()),
//             id: ctx.query.id,
//             messages: JSON.stringify(messages)
//         }
//     }

// }

const Container = styled.div`
    display: flex;
    background-color: #f8fafc;
    width: 100%;
`

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    max-height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`