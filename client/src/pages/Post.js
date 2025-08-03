import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import {useNavigate} from 'react-router-dom'

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
        alert("Could not fetch the post. Please try again later.");
      });

    axios
      .get(`http://localhost:3001/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch comments:", error);
        alert("Could not fetch comments.");
      });
  }, [id]);

  const addComment = () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id, // if backend sends id
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        alert("Failed to add comment.");
      });
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id !== commentId));
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment.");
      });
  };
  const deletePost =(id)=>{
    axios.delete(`http://localhost:3001/posts/${id}`, {headers:{accessToken: localStorage.getItem("accessToken")}}).then(()=>{
      alert("Post Deleted");
      navigate("/");
    })
  }
  const editPost = (option) =>{
      if(option==='title'){
        let newTitle = prompt("Enter new title");
        axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id}, 
          {
            headers:{accessToken: localStorage.getItem("accessToken")

          }}
        )
        setPostObject({...postObject, title: newTitle})
      }
      else{
        let newPostText = prompt("Enter new text");
        axios.put("http://localhost:3001/posts/postText", {newText: newPostText, id: id}, 
          {
            headers:{accessToken: localStorage.getItem("accessToken")

          }}
        )
        setPostObject({...postObject, postText: newPostText})
      }
  }
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title" onClick={()=>{
            if(authState.username===postObject.username) editPost("title");
          }}> {postObject.title} </div>
          <div className="body" onClick={()=>{
            if(authState.username===postObject.username) editPost('body');
          }}>{postObject.postText}</div>
          <div className="footer">{postObject.username} {authState.username === postObject.username && <button
          onClick={() => {deletePost(postObject.id)}}>Delete Post</button>}</div>
        </div>
      </div>

      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button onClick={addComment}> Add Comment </button>
        </div>

        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="comment">
              {comment.commentBody}
              <label> Username: {comment.username}</label>
              {authState.username === comment.username && (
                <button onClick={() => deleteComment(comment.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
