import CulturePost from '../components/postspage/CulturePost';
import LanguagePost from '../components/postspage/LanguagePost';
import '../styles/PostCategory.scss';
import '../styles/PostSearch.scss'
import '../styles/Font.scss';
import Header from '../components/postspage/PostsHeader';
import Topbar from '../components/Topbar';
import '../styles/PostsPage.scss';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

function PostsPage() {
    const [cookies, setCookies, removeCookies] = useCookies(['id']);
    const idCookie = cookies['id'];
    const [showLanguagePosts, setShowLanguagePosts] = useState(true);
    const [showCulturePosts, setShowCulturePosts] = useState(false);
    const [newAlarmNum, setNewAlarmNum] = useState<Number>(0);
    const [culturePosts, setCulturePosts] = useState([]);
    const [languagePosts, setLanguagePosts] = useState([]);
    const [searchCulturePosts, setSearchCulturePosts] = useState([]);
    const [searchLanguagePosts, setSearchLanguagePosts] = useState([]);

    const [showSearchResults, setShowSearchResults] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const handleLanguageClick = () => {
        setShowLanguagePosts(!showLanguagePosts);
        setShowCulturePosts(false);
        setShowSearchResults(false);
    };

    const handleCultureClick = async () => {
        setShowLanguagePosts(false);
        setShowCulturePosts(!showCulturePosts);
        setShowSearchResults(false);
    };

    const getSearchResults = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: '/posts/results',
                params: {
                    searchQuery: searchQuery,
                    userid: idCookie,
                },
                withCredentials: true,
            });
            console.log(res.data);
            setSearchCulturePosts(res.data.SearchPosts.c);
            setSearchLanguagePosts(res.data.SearchPosts.l);

            //검색결과가 있을 때만 검색 결과를 보여주도록
            setShowSearchResults(true);
            
            console.log('searchCulturePosts', searchCulturePosts);
            console.log('searchLanguagePosts', searchLanguagePosts);
        }catch (error) {
            console.log('error', error);
        }
    }

    const getCulturePosts = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: '/cul/posts',
                params: {
                    userid: idCookie,
                },
                withCredentials: true,
            });
            setCulturePosts(res.data.PostsDatas);
            console.log(culturePosts);
        } catch (error) {
            console.log('error', error);
        }
    };

    const getLanguagePosts = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: '/lang/posts',
                params: {
                    userid: idCookie,
                },
                withCredentials: true,
            });
            console.log(res.data);
            setLanguagePosts(res.data.PostsDatas);
        } catch (error) {
            console.log('error', error);
        }
    };

    const newAlarmNumGet = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: 'newAlarmNumGet',
                params: {
                    userid: idCookie,
                },
                withCredentials: true,
            });
            setNewAlarmNum(res.data.newAlarmNumber);
        } catch (error) {
            console.log('error:', error);
        }
    };
    useEffect(() => {
        newAlarmNumGet();
        getLanguagePosts();
    }, []);

    return (
        <div className="postspage-container">
            <Topbar />
            <Header newAlarmNum={newAlarmNum} />
            <div className='search-container'>
                <div className='searchbar'>
                    <input className='searchbar-input' type="text" placeholder='Type something here...' value={searchQuery} onChange={(e)=>{
                        setSearchQuery(e.target.value);
                    }}/>
                </div>
                <button className="search-button" onClick={()=>{getSearchResults()}}>Search</button>
            </div>
            <div className="category-component">
                <div
                    className={`btn_lang ${
                        showLanguagePosts
                            ? 'active category-component-changed'
                            : ''
                    }`}
                    onClick={handleLanguageClick}
                >
                    Language
                </div>
                <br />
                <div
                    className={`btn_culture ${
                        showCulturePosts
                            ? 'active category-component-changed'
                            : ''
                    }`}
                    onClick={() => {
                        handleCultureClick();
                        getCulturePosts();
                    }}
                >
                    Culture
                </div>
                <br />
            </div>

            {showLanguagePosts && !showSearchResults && (
            <div className="language-posts-container">
             {languagePosts.length > 0 ? (
             languagePosts
              .slice(0)
              .reverse()
              .map((languagePostData: any) => (
                <LanguagePost
                  key={languagePostData[0].postId}
                  userid={languagePostData[0].userid}
                  name={languagePostData[0].User.name}
                  id={languagePostData[0].postId}
                  nation={languagePostData[0].User.nation}
                  firLang={languagePostData[0].User.firLang}
                  createdAt={languagePostData[0].createdAt}
                  content={languagePostData[0].content}
                  likecount={languagePostData[1]}
                  commentcount={languagePostData[3]}
                />
              ))
          ) : (
            <p>No language posts found.</p>
          )}
            </div>
        )}

            {showCulturePosts && !showSearchResults && (
            <div className="culture-posts-container">
            {culturePosts.length > 0 ? (
                culturePosts
                .slice(0)
                .reverse()
                .map((culturePostData: any) => (
                    <CulturePost
                    key={culturePostData[0].postId}
                    id={culturePostData[0].postId}
                    userid={culturePostData[0].userid}
                    name={culturePostData[0].User.name}
                    nation={culturePostData[0].User.nation}
                    firLang={culturePostData[0].User.firLang}
                    learningLang={culturePostData[0].User.firLang}
                    createdAt={culturePostData[0].createdAt}
                    content={culturePostData[0].content}
                    images={culturePostData[0]}
                    likecount={culturePostData[1]}
                    commentcount={culturePostData[3]}
                    />
                ))
            ) : (
                <p>No culture posts found.</p>
            )}
            </div>
            )}
            
            {showSearchResults && (
             <div className="search-results-container">
            {searchLanguagePosts.length > 0 && (
                <div className="language-posts-container">
                {searchLanguagePosts
                    .slice(0)
                    .reverse()
                    .map((languagePostData: any) => (
                    <LanguagePost
                        key={languagePostData.postId}
                        userid={languagePostData.userid}
                        name={languagePostData.User.name}
                        id={languagePostData.postId}
                        nation={languagePostData.User.nation}
                        firLang={languagePostData.User.firLang}
                        createdAt={languagePostData.createdAt}
                        content={languagePostData.content}
                        likecount={languagePostData.likecount}
                        commentcount={languagePostData.commentcount}
                    />
                    ))}
                </div>
            )}

                {searchCulturePosts.length > 0 && (
                <div className="culture-posts-container">
                {searchCulturePosts
                    .slice(0)
                    .reverse()
                    .map((culturePostData: any) => (
                    <CulturePost
                        key={culturePostData.postId}
                        id={culturePostData.postId}
                        userid={culturePostData.userid}
                        name={culturePostData.User.name}
                        nation={culturePostData.User.nation}
                        firLang={culturePostData.User.firLang}
                        learningLang={culturePostData.User.firLang}
                        createdAt={culturePostData.createdAt}
                        content={culturePostData.content}
                        images={culturePostData}
                        likecount={culturePostData.likecount}
                        commentcount={culturePostData.commentcount}
                    />
                    ))}
                </div> 
            )}

            {searchLanguagePosts.length === 0 && searchCulturePosts.length === 0 && (
                        <p>No matching posts found.</p>
                    )}
                    </div>
                )}

            <Footer />
        </div>
    );
}

export default PostsPage;
