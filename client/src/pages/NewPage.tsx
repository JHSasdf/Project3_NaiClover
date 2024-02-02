import '../styles/NewPage.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import useErrorHandler from '../utils/useErrorHandler';
import Topbar from '../components/Topbar';
import { Link } from 'react-router-dom';
import { getCurrentData3 } from '../utils/getCurrentData';

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
    isFirst: boolean;
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
    const [roomName, setRoomName] = useState();
    const userid = cookies['id'];

    const navigate = useNavigate();
    // 채팅 끝난 시점
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

        // 여기서 사용자의 ID를 쿠키에서 읽어와서 socket.id로 전달합니다.
        socket.emit('userId', userIdFromCookie);

        return () => {
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
            setRoomName(res.data.roomInfo.roomName);
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
    // 스크롤 항상 아래로
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Topbar />
            <div className="chat-room-container">
                {/* 설정 헤드 부분 */}
                <div className="chat-room-C-Header">
                    {/* <Link to="/monochat"> */}
                    <div
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <img src="/images/BackPoint.png" alt="" />
                    </div>
                    {/* </Link> */}
                    <div className="chat-room-name">{roomName}</div>
                    <div className="chat-room-peopleNum">6</div>
                </div>

                <div className="chating-content-area">
                    {chatLog.map((elem) => (
                        <div key={elem.chatIndex}>
                            {/* 상단에 사용자 ID 표시 */}
                            {elem.isFirst === true ? (
                                <div className="alert-message-div">
                                    <div className="user-id">
                                        {elem.User.name} 님이 입장했습니다.
                                    </div>
                                </div>
                            ) : (
                                <div className="messages-container">
                                    {elem.userid === userid ? (
                                        <div className="sent-message">
                                            <div className="sent-message-footer">
                                                <div className="sent-message-time">
                                                    {getCurrentData3(
                                                        new Date(elem.createdAt)
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        elem.chatCounting === 0
                                                            ? 'sent-message-read hide'
                                                            : 'sent-message-read'
                                                    }
                                                >
                                                    {elem.chatCounting}
                                                </div>
                                            </div>
                                            <div className="sent-message-content">
                                                <div className="sent-message-contentarea">
                                                    <div>{elem.content}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="received-message">
                                            <div className="received-message-header">
                                                <div className="received-message-image">
                                                    <img
                                                        src={
                                                            elem.User
                                                                .profileImgPath
                                                        }
                                                        alt=""
                                                    />
                                                </div>

                                                <div className="received-message-flag">
                                                    <img
                                                        src="/images/flag/china.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="received-message-username">
                                                    <div>{elem.User.name}</div>
                                                </div>
                                            </div>
                                            <div className="received-message-middle">
                                                <div className="received-message-content">
                                                    <div className="received-message-contentarea">
                                                        <div>
                                                            {elem.content}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="received-message-footer">
                                                    <div className="received-message-time">
                                                        {getCurrentData3(
                                                            new Date(
                                                                elem.createdAt
                                                            )
                                                        )}
                                                    </div>
                                                    <div
                                                        className={
                                                            elem.chatCounting ===
                                                            0
                                                                ? 'received-message-read hide'
                                                                : 'received-message-read'
                                                        }
                                                    >
                                                        {elem.chatCounting}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* 채팅 끝난 시점 */}
                    <div ref={messagesEndRef} />
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                                console.log(e.key);
                            }
                        }}
                    />
                    <button onClick={handleSendMessage} className="send-button">
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatRoomPage;
