import React from 'react';
import Joi from 'joi-browser';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
// import { GET_COMMENTS_QUERY } from './comments';

const UPDATE_COMMENT_MUTATION = gql`
  mutation updateComment(
    $id: ID!
    $name: String!
    $email: String!
    $body: String!
  ) {
    updateComment(id: $id, input: { name: $name, email: $email, body: $body }) {
      id
      name
      email
      body
    }
  }
`;

const EditComment = (props) => {
  const { data } = props.location.state;
  const [id] = useState(data.id);
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [body, setBody] = useState(data.body);
  const [errors, setErrors] = useState({});

  const resetInput = () => {
    setName('');
    setEmail('');
    setBody('');
    props.history.push('/comments');
  };

  const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION, {
    // update: updateCache,
    onCompleted: resetInput,
  });

  const handleCancle = () => {
    props.history.push('/comments');
  };

  const schema = {
    id: Joi.number(),
    name: Joi.string().required().label('Name'),
    email: Joi.string().required().email().label('Email'),
    body: Joi.string().required().label('Description'),
  };

  const handleChange = ({ currentTarget: input }) => {
    const er = errors;
    const errorMessage = validateProperty(input);
    if (errorMessage) er[input.name] = errorMessage;
    else delete er[input.name];
    setErrors(er);
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema1 = { [name]: schema[name] };
    const { error } = Joi.validate(obj, schema1);
    return error ? error.details[0].message : null;
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate({ id, name, email, body }, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const submitData = (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors || {});
    if (errors) return false;
    updateComment({
      variables: { id, name, email, body },
      optimisticResponse: true,
    //   update: (cache) => {
    //     const existingComments = cache.readQuery({ query: GET_COMMENTS_QUERY });
    //       const newComment = data;
    //       const updatedComments = existingComments.comments.data.forEach(x => {
    //           if (x.id === newComment.id) {
    //                x = newComment;
    //           }
    //       });
    //     cache.writeQuery({
    //       query: GET_COMMENTS_QUERY,
    //       data: { data:[...updatedComments.comments.data] },
    //     });
    //   },
    });
  };

  return (
    <div className='main'>
      <div className='container'>
        <form
          className='commentForm'
          onSubmit={(e) => {
            submitData(e);
          }}
        >
          <div className='card card-body'>
            <h3 className='text-center mb-2'>Add Comment</h3>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type='name'
                className='form-control'
                id='name'
                name='name'
                placeholder='name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleChange(e);
                }}
              />
              {!!errors['name'] && (
                <div className='alert alert-danger'>{errors['name']}</div>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                className='form-control'
                id='email'
                name='email'
                placeholder='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleChange(e);
                }}
              />
              {!!errors['email'] && (
                <div className='alert alert-danger'>{errors['email']}</div>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='body' placeholder='description'>
                Description
              </label>
              <textarea
                id='body'
                className='form-control'
                name='body'
                onChange={(e) => {
                  setBody(e.target.value);
                  handleChange(e);
                }}
                value={body}
              ></textarea>
              {!!errors['body'] && (
                <div className='alert alert-danger'>{errors['body']}</div>
              )}
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-primary mr-2'>
                Submit
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleCancle}
              >
                Cancle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditComment;
