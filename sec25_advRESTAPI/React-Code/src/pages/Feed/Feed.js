import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client'//socket.io

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

/*get user status handling*/
  componentDidMount() {
    fetch('http://localhost:8080/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
    const socket = openSocket('http://localhost:8080');
    socket.on('posts', data => {
      if( data.action === 'create'){
        this.addPost(data.post)
      }else if (data.action === 'update') {
        this.updatePost(data.post);
      } else if (data.action === 'delete') {
        this.loadPosts();
      }
    })
  }

/*for socket connection instant feed view*/
addPost = post => {
  this.setState(prevState => {
    const updatedPosts = [...prevState.posts];
    if (prevState.postPage === 1) {
      if (prevState.posts.length >= 2) {
        updatedPosts.pop();
      }
      updatedPosts.unshift(post);
    }
    return {
      posts: updatedPosts,
      totalPosts: prevState.totalPosts + 1
    };
  });
  
}

//added for socket
updatePost = post => {
  this.setState(prevState => {
    const updatedPosts = [...prevState.posts];
    const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
    if (updatedPostIndex > -1) {
      updatedPosts[updatedPostIndex] = post;
    }
    return {
      posts: updatedPosts
    };
  });
};

/*fetch all post*/
  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    fetch('http://localhost:8080/feed/post?page='+ page,{
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);//result in browser
        console.log(resData.totalItems)
        this.setState({
          //posts: resData.posts,
          posts: resData.posts.map(post => {
            return {
              ...post,
              imagepath: post.imageUrl//copying imageUrl in imagePath . because in edit mode .we will reuse.components->FeedEdit
            }
          }),
          totalPosts: resData.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };


  /*user updated status handling*/

  statusUpdateHandler = event => {
    event.preventDefault();
    fetch('http://localhost:8080/auth/status',{
      method: 'PATCH',
      body: JSON.stringify({
        status: this.state.status
      }),
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  /*add or edit post*/
  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();//buildin obj
    formData.append('title', postData.title)
    formData.append('content', postData.content)
    formData.append('image', postData.image)

    let url = 'http://localhost:8080/feed/post';
    let method = 'POST'
    if (this.state.editPost) {
      url = 'http://localhost:8080/feed/post/' + this.state.editPost._id;
      method = 'PUT'
    }
    console.log(url,method)
    //console.log(postData.title,postData.content)
    /*url requested with method and data is send*/
   /*  //application/json //sent data without image
    fetch(url,{
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content
      })
    }) */
    fetch(url,{
      method: method,
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
  
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          imagePath: resData.post.imageUrl,//line added bcz old image path error
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt
        };
        this.setState(prevState => {//removed for socket
          /*let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }*/
          return {
            //posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        //console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  /*deleting post*/ 
  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/feed/post/'+ postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();//added after socket
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
