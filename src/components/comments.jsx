import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';

const GET_COMMENTS_QUERY = gql`
  query comments {
    comments {
      data {
        id
        name
        email
        body
      }
    }
  }
`;

const DELETE_COMMENT_QUERY = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

const Comments = (props) => {
  const { comments } = props;
  let commentsList = comments.data;
  const [deleteComment] = useMutation(DELETE_COMMENT_QUERY);
  const addComment = () => {
    props.history.push('/add-comment');
    // return <Redirect to='/add-comment' />
  };

  const updateComments = (comment) => {
    props.history.push('/edit-comment/' + comment.id, { data: comment });
  };

  const deleteCommentData = (comment) => {
    deleteComment({
      variables: { id: comment.id },
      update: (cache) => {
        const existingComments = cache.readQuery({ query: GET_COMMENTS_QUERY });
        const comments = existingComments.comments.data.filter(
          (t) => t.id !== comment.id
        );
        cache.writeQuery({
          query: GET_COMMENTS_QUERY,
          data: comments ,
        });
      },
    });
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className='container'>
        <button
          className='btn btn-primary mb-2 float-right'
          onClick={addComment}
        >
          Add comment
        </button>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commentsList.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.name}</td>
                <td>{comment.email}</td>
                <td>{comment.body}</td>
                <td>
                  <a
                    className='mr-2 ml-2'
                    onClick={() => updateComments(comment)}
                  >
                    <i className='fa fa-pencil'></i>
                  </a>
                  <a
                    className='mr-2 ml-2'
                    onClick={() => deleteCommentData(comment)}
                  >
                    <i className='fa fa-trash'></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommentListQuery = () => {
  const history = useHistory();
  const { loading, error, data } = useQuery(GET_COMMENTS_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  return <Comments comments={data.comments} history={history} />;
};


export default CommentListQuery;
export { GET_COMMENTS_QUERY };
