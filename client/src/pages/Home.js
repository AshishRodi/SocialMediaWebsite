import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import likes from '../assets/likedBttn.jpg'; // Adjust path if needed
// import { AuthContext } from '../helpers/AuthContext';
//import { post } from '../../../server/routes/Posts';
import unlike from '../assets/unlikedBtttn.png'; // Adjust path if needed


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  // const {authState} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  });


  const likeAPost = (postId) => {
  axios
    .post(
      "http://localhost:3001/likes",
      { PostId: postId },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    )
    .then((response) => {
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {
            const updatedLikes = response.data.liked
              ? [...post.Likes, 0]
              : post.Likes.slice(0, -1);
            return { ...post, Likes: updatedLikes };
          } else {
            return post;
          }
        })
      );

      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    })
    .catch((error) => {
      console.error("Failed to like/unlike post:", error);
    });
};


  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div className="post" key={key}>
          <div className="title">{value.title}</div>
          <div className="body" onClick={() => navigate(`/post/${value.id}`)}>
            {value.postText}
          </div>
          <div className="footer">
            <div className='username'>
              <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
            </div>
            {value.username}
            <img
  src={likedPosts.includes(value.id) ? likes : unlike}
  alt="Like"
  onClick={() => likeAPost(value.id)}
  className="like-button-img"
  style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '10px' }}
/>

            <label>{value.Likes.length}</label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
