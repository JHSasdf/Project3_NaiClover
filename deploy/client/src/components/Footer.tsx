import { useState } from 'react';
import '../styles/Footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
    const navMessage = '/images/Chats.png';
    const navMessageColor = '/images/ChatsColor.png';
    const navPosts = '/images/globesimple.png';
    const navPostsColor = '/images/globesimpleColor.png';
    const navusersfour = '/images/UsersFour.png';
    const navusersfourColor = '/images/UsersFourColor.png';
    const navFavorites = '/images/bookmarks.png';
    const navFavoritesColor = '/images/bookmarksColor.png';
    const navMypage = '/images/user.png';
    const navMypageColor = '/images/userColor.png';

    const [hoveredDiv, setHoverdDiv] = useState('');
    const [clickedDiv, setClickedDiv] = useState('');

    const onMouseOver = (divName: string) => {
        setHoverdDiv(divName);
    };

    const onMouseLeave = () => {
        setHoverdDiv('');
    };

    // 클릭 시 변경된 이미지 고정.
    const clickMouse = (divName: string) => {
        setClickedDiv(divName);
    };

    return (
        <footer className="footer">
            <Link to={'/message'}>
                <div
                    className={`footer-div footerMessage ${
                        hoveredDiv === 'footerMessage' && 'hovered'
                    } ${clickedDiv === 'footerMessage' && 'text-change'}`} // 클래스가 footerMessage 이면 hovered, text-change 클래스를 가진다.
                    onMouseOver={() => onMouseOver('footerMessage')}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() => clickMouse('footerMessage')}
                >
                    <img
                        className="footer-div-message-img"
                        src={
                            hoveredDiv === 'footerMessage' ||
                            clickedDiv === 'footerMessage'
                                ? navMessageColor
                                : navMessage
                        }
                        alt=""
                    />
                    <div className="text">Message</div>
                </div>
            </Link>
            <Link to={'/posts'}>
                <div
                    className={`footer-div posts ${
                        hoveredDiv === 'posts' && 'hovered'
                    }
          ${clickedDiv === 'posts' && 'text-change'}`}
                    onMouseOver={() => onMouseOver('posts')}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() => clickMouse('posts')}
                >
                    <img
                        src={
                            hoveredDiv === 'posts' || clickedDiv === 'posts'
                                ? navPostsColor
                                : navPosts
                        }
                        alt=""
                    />
                    <div className="text">Posts</div>
                </div>
            </Link>
            <Link to={'/monochat'}>
                <div
                    className={`footer-div usersfour ${
                        hoveredDiv === 'usersfour' && 'hovered'
                    } ${clickedDiv === 'usersfour' && 'text-change'}`}
                    onMouseOver={() => onMouseOver('usersfour')}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() => clickMouse('usersfour')}
                >
                    <img
                        src={
                            hoveredDiv === 'usersfour' ||
                            clickedDiv === 'usersfour'
                                ? navusersfourColor
                                : navusersfour
                        }
                        alt=""
                    />
                    <div className="text">MonoChat</div>
                </div>
            </Link>
            <Link to={'/errorlog'}>
                <div
                    className={`footer-div favorites ${
                        hoveredDiv === 'favorites' && 'hovered'
                    } ${clickedDiv === 'favorites' && 'text-change'}`}
                    onMouseOver={() => onMouseOver('favorites')}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() => clickMouse('favorites')}
                >
                    <img
                        src={
                            hoveredDiv === 'favorites' ||
                            clickedDiv === 'favorites'
                                ? navFavoritesColor
                                : navFavorites
                        }
                        alt=""
                    />
                    <div className="text">ErrorLog</div>
                </div>
            </Link>
            <Link to={'/mypage'}>
                <div
                    className={`footer-div mypage ${
                        hoveredDiv === 'mypage' && 'hovered'
                    } ${clickedDiv === 'mypage' && 'text-change'}`}
                    onMouseOver={() => onMouseOver('mypage')}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() => clickMouse('mypage')}
                >
                    <img
                        src={
                            hoveredDiv === 'mypage' || clickedDiv === 'mypage'
                                ? navMypageColor
                                : navMypage
                        }
                        alt=""
                    />
                    <div className="text">MyPage</div>
                </div>
            </Link>

            <div className="edge"></div>
        </footer>
    );
}

export default Footer;
