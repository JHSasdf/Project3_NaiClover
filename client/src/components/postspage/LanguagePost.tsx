import '../../styles/LanguagePost.scss';
import '../../styles/Font.scss';
import {useNavigate} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {useState} from 'react';
import { useEffect } from 'react';

function LanguagePost(props: any) {
    const navigate = useNavigate();

    const {id} = props;

    const [cookies, setCookies, removeCookies] = useCookies(['id']);
    const idCookie = cookies['id'];

    const [isLiked, setIsLiked] = useState(false);

    //언어 좋아요 버튼 토글
    const langToggleLike = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `/lang/posts/${id}`,
                data: {
                    userid: idCookie
                }

            });
            console.log(res.data);

            setIsLiked((prevIsLiked) => !prevIsLiked);
        }catch(error){
            console.log('error', error);
        }
    }


    return(
    <div className='lang-post-container'>
        <div className='lang-post'>
            <div className='lang-profile-container'>
                <div className='lang-image-container'>
                    <div className='lang-profile-image'></div>
                    <div className='lang-flag-image'></div>
                </div>

                <div className='lang-info-container'>
                    <div className='lang-info'>
                        <div className='lang-gender lang-male'></div>
                        <div className='lang-name'>{props.name}</div>
                    </div>
                    <div className='lang-location'>{props.nation}</div>

                    <div className='lang-language-container'>
                        <div className='lang-native-language'>EN</div>
                        <div className='lang-arrow'></div>
                        <div className='lang-learning-language'>KR</div>
                    </div>
                </div>
            </div>

            <div className='lang-more-container'>
                <div className='lang-time'>{props.createdAt}</div>
                <div className='lang-more'></div>
            </div>

            <div className='lang-content-text' onClick={()=>navigate(`/l-postdetail/${props.id}`)}>{props.content}</div>

            <div className='lang-reaction-container'>
                <div className='lang-likes-container'>
                    <div className={`lang-likes' ${isLiked ? 'liked' : 'unliked'}`} onClick={()=>{langToggleLike()}}></div>
                    <div className='lang-likes-count'>524</div>
                </div>

                <div className='lang-comments-container' onClick={()=>navigate('/l-postdetail')}>
                    <div className='lang-comments'></div>
                    <div className='lang-comments-count'>8</div>
                </div>

                <div className='lang-bookmark-container'>

                </div>
            </div>
        </div>
        <div className='lang-line'></div>
    </div>
    )
}

export default LanguagePost;