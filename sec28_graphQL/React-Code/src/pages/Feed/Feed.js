import React, { Component, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  /*get user status handling*/
  componentDidMount() {
    const graphqlQuery = {
      query:`
        {
           userStatus {
              status
           }
        }
      
      `
    }
    fetch("http://localhost:8080/graphql", {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData)
        if (resData.errors) {
          throw new Error("Status fetch failed!");
        }
        this.setState({ status: resData.data.userStatus.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  /*fetch all post*/
  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }
    const graphqlQuery = {
      query: `
        query FetchPosts($pageInput: Int!){ 
          getAllPosts(page: $pageInput) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }`,
        variables:{
          pageInput: page
        }
    };
    fetch("http://localhost:8080/graphql", {
      method:'POST',
      headers: {
        Authorization: "Bearer " + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData)
        if (resData.errors) {
          throw new Error("Fetching post failed!");
        }
        //console.log(resData); //result in browser
        //console.log(resData.totalItems);
        this.setState({
          //posts: resData.posts,
          posts: resData.data.getAllPosts.posts.map((post) => {
            return {
              ...post,
              imagepath: post.imageUrl, //copying imageUrl in imagePath . because in edit mode .we will reuse.components->FeedEdit
            };
          }),
          totalPosts: resData.data.getAllPosts.totalPosts,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  /*user updated status handling*/

  statusUpdateHandler = (event) => {
    event.preventDefault();
    const graphqlQuery = { 
      query: `
         mutation UpdateUserStatus($userStatus: String!){
            updateStatus(status: $userStatus) {
                status
            }
         }`,
         variables: {
          userStatus: this.state.status
         }
    }
    fetch("http://localhost:8080/graphql", {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Fetching post failed!");
        }
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  /*add or edit post*/
  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    const formData = new FormData(); //buildin obj
    formData.append("image", postData.image);
    if(this.state.editPost){
      formData.append('oldPath', this.state.editPost.imagePath)
    }
    fetch('http://localhost:8080/post-image',{
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + this.props.token
      },
      body: formData
    }).then(res=> res.json())
    .then(fileResData => {
      const imageUrl = fileResData.filePath || 'undefined'
      console.log(`imageUrl ${imageUrl}`)
      let graphqlQuery = {
        query: `
            mutation CreateNewPost($titleInput: String!, $contentInput: String!, $imageUrlInput: String!){
                createPost(postInput: { title: $titleInput, content: $contentInput, imageUrl: $imageUrlInput}){
                    _id
                    title
                    content
                    imageUrl
                    creator {
                        name
                    }
                    createdAt
                }
            }
        `,
        variables: {
          titleInput: postData.title,
          contentInput: postData.content,
          imageUrlInput: imageUrl
        }
      };
      if(this.state.editPost){
        graphqlQuery = {
          query: `
              mutation UpdatePost($postId: ID!, $titleInput: String!, $contentInput: String!, $imageUrlInput: String!){
                  updatePost(id: $postId, postInput: { title: $titleInput, content: $contentInput, imageUrl: $imageUrlInput}){
                      _id
                      title
                      content
                      imageUrl
                      creator {
                          name
                      }
                      createdAt
                  }
              }
          `,
          variables: {
            postId: this.state.editPost._id,
            titleInput: postData.title,
            contentInput: postData.content,
            imageUrlInput: imageUrl
          }
        };

        
      }
      return fetch("http://localhost:8080/graphql", {
        method: "POST",
        body: JSON.stringify(graphqlQuery),
        headers: {
          Authorization: "Bearer " + this.props.token,
          "Content-Type": "application/json",
        },
      })
    })
    .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors.status === 422) {
          throw new Error("Validation failed.");
        }
        if (resData.errors) {
          throw new Error("Creating or editing a post failed!");
        }
        console.log(resData);
        let resDataField = 'createPost';
        if(this.state.editPost){
          resDataField = 'updatePost'
        }
        const post = {
          _id: resData.data[resDataField]._id,
          title: resData.data[resDataField].title,
          imagePath: resData.data[resDataField].imageUrl, //line added bcz old image path error
          content: resData.data[resDataField].content,
          creator: resData.data[resDataField].creator,
          createdAt: resData.data[resDataField].createdAt,
        };
        this.setState((prevState) => {
          let updatedPosts = [...prevState.posts];
          let updatedTotalPost = prevState.totalPosts;
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else {
            updatedTotalPost++;
            if(prevState.posts.length>=2){

              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: updatedTotalPost
          };
          
        });
      })
      .catch((err) => {
        //console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  /*deleting post*/
  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    const graphqlQuery = {
      query: `
          mutation deletePost($deletePostId: ID!){
             deletePost(id: $deletePostId)
          }
      `,
      variables: {
        deletePostId : postId
      }
    }
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (resData.errors) {
          throw new Error("Delete post failed!");
        }
        this.loadPosts(); //added after socket
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
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
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString("en-US")}
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
