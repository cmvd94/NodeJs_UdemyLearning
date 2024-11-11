import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  /*get detail of single post*/
  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `query FetchingAPost($fetchId: ID!){
          getAPost(id: $fetchId){
              title
              content
              imageUrl
              creator{
                 name 
              }
              createdAt
          }
      }`,
      variables: {
        fetchId: postId
      }
    }
    fetch('http://localhost:8080/graphql',{
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData)
        if (resData.errors) {
          throw new Error('Failed to fetch post');
        }
        this.setState({
          title: resData.data.getAPost.title,
          author: resData.data.getAPost.creator.name,
          image: 'http://localhost:8080/'+ resData.data.getAPost.imageUrl,
          date: new Date(resData.data.getAPost.createdAt).toLocaleDateString('en-US'),
          content: resData.data.getAPost.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /*single post fields title,author,date,image,content*/
  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
