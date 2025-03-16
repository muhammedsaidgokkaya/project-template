import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { CONFIG } from 'src/global-config';
import { PostCommentItem } from './post-comment-item';

// ----------------------------------------------------------------------

export function PostCommentList({ taskId }) {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `${CONFIG.apiUrl}/Task/task-comments?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setComments(data); 
    } catch (error) {
      console.error("Yorumları çekerken hata oluştu", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <>
      {comments.map((comment) => {
        const userId = comment.userId || comment.id; // userId yoksa id kullan
        const imageSrc =
          [
            `/user/${userId}.png`,
            `/user/${userId}.jpg`,
            `/user/${userId}.jpeg`,
          ].find((src) => {
            const img = new Image();
            img.src = src;
            return img.complete;
          }) || comment.name?.charAt(0)?.toUpperCase();

        return (
          <Box key={comment.id}>
            <PostCommentItem
              name={comment.name}
              message={comment.message}
              postedAt={comment.postedAt}
              avatarUrl={imageSrc}
            />
          </Box>
        );
      })}
    </>
  );
}
