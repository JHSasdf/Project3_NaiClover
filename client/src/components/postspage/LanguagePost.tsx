import '../../styles/LanguagePost.scss';
import '../../styles/Font.scss';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { User } from '../../types/types';
import { Link } from 'react-router-dom';
import { cookieConfig } from '../../utils/cookieConfig';

function LanguagePost(props: any) {
    const navigate = useNavigate();

    const { id, likeCount, isLiked } = props;
    const [cookies, setCookies, removeCookies] = useCookies(['id', 'content']);
    const idCookie = cookies['id'];
    const [profileImg, setProfileImg] = useState<string>('');
    const [userData, setUserData] = useState<User>();
    const [learningLang, setLearningLang] = useState();
    const [didLike, setDidLike] = useState(isLiked);
    const [likeCountState, setLikeCountState] = useState(likeCount);
    const shortName = (nation: string | undefined): string | undefined => {
        if (nation === 'China' || nation === 'Chinese') {
            return 'CN';
        } else if (nation === 'America' || nation === 'English') {
            return 'US';
        } else if (nation === 'France' || nation === 'French') {
            return 'FR';
        } else if (nation === 'Germany' || nation === 'German') {
            return 'GM';
        } else if (nation === 'Japan' || nation === 'Japanese') {
            return 'JP';
        } else {
            return 'KR';
        }
    };
    const getMyPage = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: `/userinfo/${props.userid}`,
                params: {
                    userid: props.name,
                },
                withCredentials: true,
            });
            setUserData(res.data.userDataObj);
            setLearningLang(res.data.learningLang);
        } catch (error) {
            console.log('error???', error);
        }
    };
    useEffect(() => {
        getMyPage();
    }, [props.id]);


    const deletemodal = useRef<any>();
    const langdeletemodal = deletemodal.current;

    const modalShow = () => {
        langdeletemodal?.classList.remove('opacity');
        setTimeout(() => {
            langdeletemodal?.classList.add('opacity');
        }, 5000);
    };

    const deletePost = async () => {
        try {
            const res = await axios({
                method: 'delete',
                url: `/lang/posts/${props.id}`,
                data: {
                    userid: props.userid,
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error('error', error);
        }
    };
    //언어 좋아요 버튼 토글
    const langToggleLike = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `/lang/posts/${id}`,
                data: {
                    userid: idCookie,
                },
                withCredentials: true,
            });
          
            if (didLike) {
                setLikeCountState(likeCountState - 1);
            } else {
                setLikeCountState(likeCountState + 1);
            }
            setDidLike(!didLike);

        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className="lang-post-container">
            <div className="lang-post">
                <div className="lang-profile-container">
                    <div className="lang-image-container">
                        <img
                            className="lang-profile-image"
                            src={props.profileImgPath}
                            alt=""
                            onClick={() => {
                                window.location.href = `/searchUser/${props.userid}`;
                            }}
                        ></img>

                        <img
                            className="lang-flag-image"
                            src={`/images/flag/${
                                idCookie == id ? userData?.nation : props.nation
                            }.png`}
                        ></img>
                    </div>

                    <div className="lang-info-container">
                        <div className="lang-info">
                            <div className={`cul-gender' ${
                                props.gender==='f' ? 'cul-female' : 'cul-male'
                            }`}></div>
                            <Link
                                className="lang-name"
                                to={`/searchUser/${props.userid}`}
                            >
                                {props.name}
                            </Link>
                        </div>
                        <div className="lang-location">{props.nation}</div>

                        <div className="lang-language-container">
                            <div className="lang-native-language">
                                {shortName(props.firLang)}
                            </div>
                            <div className="lang-arrow"></div>
                            <div className="lang-learning-language">
                                {learningLang &&
                                    learningLang[0] &&
                                    shortName(learningLang[0])}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lang-more-container">
                    <div className="lang-time">{props.createdAt}</div>

                    {idCookie === props.userid ? (
                        <div>
                            <div
                                className="lang-more"
                                onClick={() => {
                                    modalShow();
                                }}
                            ></div>
                            <div
                                className="modal-container opacity"
                                ref={deletemodal}
                            >
                                <div className="edit-text">
                                    <span>수정하기</span>
                                </div>
                                <div className="modal-line"></div>
                                <div
                                    className="delete-text"
                                    onClick={() => {
                                        deletePost();
                                        window.location.href = '/posts';
                                    }}
                                >
                                    <span>삭제하기</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="correction"
                            onClick={() => {
                                setCookies(
                                    'content',
                                    props.content,
                                    cookieConfig
                                );
                                navigate(
                                    `/l-postdetail/${props.id}/correcting`
                                );
                            }}
                        ></div>
                    )}
                </div>

                <div
                    className="lang-content-text"
                    onClick={() => navigate(`/l-postdetail/${props.id}`)}
                >
                    {props.content}
                </div>

                <div className="lang-reaction-container">
                    <div className="lang-likes-container">
                        <div
                            className={`lang-likes' ${
                                didLike ? 'liked' : 'unliked'
                            }`}
                            onClick={() => {
                                langToggleLike();
                            }}
                        ></div>
                        <div className="lang-likes-count">{likeCountState}</div>

                    </div>

                    <div
                        className="lang-comments-container"
                        onClick={() => navigate(`/l-postdetail/${props.id}`)}
                    >
                        <div className="lang-comments"></div>
                        <div className="lang-comments-count">
                            {props.commentcount}
                        </div>
                    </div>
                    <div className="lang-bookmark-container"></div>
                </div>
            </div>
            <div className="lang-line"></div>
        </div>
    );
}

export default LanguagePost;
