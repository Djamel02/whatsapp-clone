import { Avatar, IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat'
import styled from "styled-components";
import CustomVerticalMenu from './CustomVerticalMenu'
import SearchIcon from '@mui/icons-material/Search'
import { NotificationsOff, ArrowForwardIos } from "@mui/icons-material";
import Chat from "./Chat";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Friends from "./Friends";
import { useAuth } from "../Auth";
import Fuse from 'fuse.js'

function Sidebar() {
    const [friends, setFriends] = useState([])
    const [searchFriends, setSearchFriends] = useState([]);
    const [input, setInput] = useState('');
    const { currentUser } = useAuth();
    const [chats, setChats] = useState([])
    const inputAreaRef = useRef(null)

    const fuse = new Fuse( friends, {
        keys: ['email','displayName']
    })

    const friendsResult = fuse.search(input)

    useEffect(() => {
        const chatRefs = collection(db, 'chats')
        const q = query(chatRefs, where('users','array-contains', currentUser.uid))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setChats(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        })

        return unsubscribe
    },[])

    useEffect(() => {
      async function fetchFriends(){
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email','!=', currentUser?.email));
          const querySnapshot = await getDocs(q);
          setFriends(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
      }
      fetchFriends()
    }, [])
    
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if(!inputAreaRef.current.contains(e.target)) {
                setTimeout(() => {
                    setSearchFriends(false)
                }, 3000)
            } else {
                setSearchFriends(true)
            }
        }
        document.addEventListener('mousedown', checkIfClickedOutside)
        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside)
        }
    },[])
    
  return (
    <Container>
        <Header>
            <UserAvatar src={currentUser.photoUrl} />
            <IconsGroup>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                
                <CustomVerticalMenu />
            </IconsGroup>
        </Header>
        <Notification>
            <NotificationAvatar>
                <NotificationsOff style={{ color: '#9de1fe'}}/>
            </NotificationAvatar>
            <NotificationText>
                <div>Get Notified of New Messages</div>
                <div style={{ display: 'flex', alignItems:'center'}}>
                    <a href="#"><u>Turn on desktop notifications</u></a>
                    <IconButton>
                        <ArrowForwardIos style={{width: 15 , height: 15}}/>
                    </IconButton>
                </div>
                </NotificationText>
        </Notification>
        <SearchChat>
            <SearchBar>
                <SearchIcon fontSize="12"/>
                <SearchInput placeholder="Search or start new chat" ref={inputAreaRef} onChange={e => setInput(e.target.value)} />
            </SearchBar>
        </SearchChat>
        {
            searchFriends ? <>
                {
                    friendsResult.map(friend => (
                        <Friends 
                            key={friend.item.id}
                            displayName={friend.item.displayName}
                            photoUrl={friend.item.photoUrl}
                            id={friend.item.id}
                        />
                    ))
                }
            </> : <>
                {
                    chats.map(chat => (
                        <Chat 
                            key={chat.id}
                            id={chat.id}
                            users={chat.users}
                            latestMessage={chat.latesMessage}
                            timestamp={chat.timestamp}
                        />
                    ))
                }
            </>
        }
        {/* {
            chats.map(chat => (
                <Chat 
                    key={chat.id}
                    id={chat.id}
                    users={chat.users}
                />
            ))
        } */}
        {/* {
            friends.map(friend => (
                <Friends 
                    key={friend.id}
                    displayName={friend.displayName}
                    photoUrl={friend.photoUrl}
                    id={friend.id}
                />
            ))
        } */}
    </Container>
  )
}

export default Sidebar
const Container = styled.div`
    background-color: #FFFFFF;
    min-width: 320px;
    max-width: 450px;
    height: 100%;
`

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #FFFFFF;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    width: 100%;
    border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }
`

const IconsGroup = styled.div``

const SearchChat = styled.div`
    background-color: white;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding: 20px;
`

const SearchBar = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 10px;
    border-bottom: 1px solid #ededed;
    background: #f6f6f6;
`

const SearchInput = styled.input`
    width: 100%;
    border: none;
    outline: none;
    background: inherit;
`;

const Notification = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #9de1fe;
`
const NotificationAvatar = styled(Avatar)`
    background: white;
`
const NotificationText = styled.div`
    display: flex;
    flex-direction: column;
`