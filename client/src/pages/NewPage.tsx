import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import './ChatRoomPage.css';
import axios from 'axios';
import useErrorHandler from '../utils/useErrorHandler';
//  유저 아이디 값을 널로 저장함으로 문제 해결
interface Message {
    text: string;
    isSentByMe?: boolean;
    userId?: string | null;
}

interface ChatLog {
    chatIndex: number;
    roomNum: string;
    userid: string;
    User: userInterface;
    content: string;
    createdAt: string;
    updataedAt: string;
    chatCounting: number;
}

interface userInterface {
    name: string;
    profileImgPath: string;
}
// 쿠키 아이디 저장
const socket = io('http://localhost:4000');
const USER_ID_COOKIE_KEY = 'id';

const ChatRoomPage: React.FC = () => {
    const { errorHandler } = useErrorHandler();
    const { roomId } = useParams<{ roomId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [chatLog, setChatLog] = useState<ChatLog[]>([]);
    const [allowedLanguage, setAllowedLanguage] = useState<string | null>(null);
    const [cookies] = useCookies(['id']);
    const userid = cookies['id'];

    useEffect(() => {
        // 페이지 로드될 때 쿠키에서 ID를 가져와서 상단에 표시
        const userIdFromCookie = Cookies.get(USER_ID_COOKIE_KEY) || null;
        setUserId(userIdFromCookie);

        socket.emit('joinRoom', roomId);

        socket.on('chat message', (msg: Message) => {
            if (msg.userId !== userIdFromCookie) {
                setMessages((prevMessages) => [...prevMessages, msg]);
                console.log(`You: ${msg.text}`);
            }
            console.log(msg);
        });

        socket.on('needReload', () => {
            fetchChatLog();
        });

        // 여기서 사용자의 ID를 쿠키에서 읽어와서 socket.id로 전달합니다.
        socket.emit('userId', userIdFromCookie);

        const handleBeforeUnload = () => {
            // 페이지를 닫기 전에 실행할 작업을 여기에 추가
            socket.emit('leaveRoom', roomId);
        };

        // beforeunload 이벤트에 이벤트 리스너 추가
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 (cleanup)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socket.off('chat message');
        };
    }, [roomId]);

    const fetchChatLog = async () => {
        try {
            const res = await axios({
                url: `/getchatlog/${roomId}`,
                method: 'get',
            });
            setChatLog(res.data.chatLog);
            console.log('챗로그', res.data);
        } catch (err: any) {
            errorHandler(err.response.status);
        }
    };
    useEffect(() => {
        // 페이지 로드될 때 쿠키에서 ID를 가져와서 상단에 표시
        fetchChatLog();
        fetchRoomLanguage();
    }, [messages]);

    const fetchRoomLanguage = async () => {
        try {
            const res = await axios({
                url: `/fetch/language/${roomId}`,
                method: 'get',
            });
            const roomLanguage = res.data.language;

            // 상단에 설정된 언어 표시
            setAllowedLanguage(roomLanguage);
        } catch (error) {
            console.error('Error fetching room language:', error);
        }
    };

    const handleSendMessage = () => {
        const message = ` ${newMessage}`;

        // 허용된 언어인지 확인
        if (allowedLanguage) {
            let regex;

            if (allowedLanguage.toLowerCase() === 'korean') {
                regex =
                    /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9!@#$%^&*()-_+=\[\]{}|;:'",.<>/?\\]*$/;
            } else if (allowedLanguage.toLowerCase() === 'english') {
                regex = /^[a-zA-Z0-9\s!@#$%^&*()-_+=\[\]{}|;:'",.<>/?]*$/;
            }

            // 초기화되지 않은 경우 빈 정규식으로 초기화
            regex = regex || new RegExp('');

            if (!regex.test(newMessage)) {
                alert(`Please enter the message in ${allowedLanguage}`);
                return;
            }
        }

        socket.emit('chat message', {
            room: roomId,
            text: message,
            isSentByMe: true,
            userId: userid,
        });
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                text: message,
                isSentByMe: false,
                userId: userid,
            },
        ]);
        setNewMessage('');
    };

    return (
        <div className="chat-room-container">
            {/* 상단에 사용자 ID 표시 */}
            {userId && (
                <div className="user-id"> {userId} 님이 입장했습니다.</div>
            )}

            <div className="messages-container">
                {chatLog.map((elem) => (
                    <ul
                        key={elem.chatIndex}
                        className={`message ${
                            elem.userid === userid
                                ? 'sent-message'
                                : 'received-message'
                        }`}
                    >
                        <li>{elem.User.name}</li>
                        <img
                            src={elem.User.profileImgPath}
                            alt=""
                            width="50px"
                            height="50px"
                        />
                        <li>{elem.content}</li>
                        <li>{elem.createdAt}</li>
                        <li>{elem.chatCounting}</li>
                    </ul>
                ))}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    placeholder={`Type your message (in ${
                        allowedLanguage || 'any language'
                    })`}
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
