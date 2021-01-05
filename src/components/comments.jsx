import React, { Component } from 'react';
import http from '../services/httpService';
import { ToastContainer } from 'react-toastify';
import config from '../config.json';
import { toast } from 'react-toastify';

class Comments extends Component {
    state = {
        comments: []
    }

    async componentDidMount() {
        let { data } = await http.get(config.apiEndPoint);
        let comments = [...data];
        if (!!this.props.location.state) {
            comments = [this.props.location.state.data, ...comments];
        }
        this.setState({ comments });
    }

    addComment = () => {
        this.props.history.push('/add-edit-comment');
    };

    updateComment = (comment) => {
        this.props.history.push('/add-edit-comment', { data: comment });
    }

    deleteComment = async comment => {
        const originalComments = this.state.comments;
        const comments = this.state.comments.filter(p => p.id !== comment.id);
        this.setState({ comments });
        try {
            await http.delete(`${config.apiEndPoint}/${comment.id}`, comment);
            toast.success('Commnet deleted successfully!');
        } catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast('This comment have been already deleted.');
            }
            this.setState({ comments: originalComments });
        }
    };

    render() {
        return (
            <div>
                <ToastContainer></ToastContainer>
                <div className="container">
                    <button className="btn btn-primary mb-2 float-right" onClick={this.addComment}>Add comment</button>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.comments.map(comment => (
                                <tr key={comment.id}>
                                    <td>{comment.name}</td>
                                    <td>{comment.email}</td>
                                    <td>{comment.body}</td>
                                    <td>
                                        <a className="mr-2 ml-2" onClick={() => this.updateComment(comment)}><i className="fa fa-pencil"></i></a>
                                        <a className="mr-2 ml-2" onClick={() => this.deleteComment(comment)}><i className="fa fa-trash"></i></a>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Comments;