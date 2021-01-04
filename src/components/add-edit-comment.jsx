import React, { Component } from 'react';
import Joi from 'joi-browser';
import config from '../config.json';
import http from '../services/httpService';
// import { toast } from 'react-toastify';

class AddEditComment extends Component {
    state = {
        data: { id: 0, name: '', email: '', body: '' },
        errors: {}
    }


    componentDidMount() {
        if (!!this.props.location.state.data) {
            let { data } = this.props.location.state;
            this.setState({ data });
        }
    }

    schema = {
        id: Joi.number(),
        name: Joi.string().required().label('Name'),
        email: Joi.string().required().email().label('Email'),
        body: Joi.string().required().label('Description')
    }

    handleCancle = () => {
        this.props.history.push('/comments');
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details)
            errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        const data = { ...this.state.data };
        data[input.name] = input.value;
        this.setState({ data, errors });
    };

    handleSubmit = e => {

        e.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        const { data } = this.state;
        const commentData = {
            name: data.name,
            email: data.email,
            body: data.body
        };
        this.addComment(commentData);

    };

    async addComment(data) {
        await http.post(config.apiEndPoint, data);
        // toast.success('Comment added successfully!');
        this.props.history.push('/comments', data);
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="main">
                <div className="container">
                    <form className="commentForm">
                        <div className="card card-body">
                            <h3 className="text-center mb-2">Add Comment</h3>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="name" className="form-control" id="name" name="name" placeholder="name" onChange={this.handleChange} />
                                {!!errors['name'] && <div className="alert alert-danger">{errors['name']}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" name="email" placeholder="email" onChange={this.handleChange} />
                                {!!errors['email'] && <div className="alert alert-danger">{errors['email']}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="body" placeholder="description" >Description</label>
                                <textarea id="body" className="form-control" name="body" onChange={this.handleChange}></textarea>
                                {!!errors['body'] && <div className="alert alert-danger">{errors['body']}</div>}
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary mr-2" onClick={this.handleSubmit}>Submit</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleCancle}>Cancle</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddEditComment;