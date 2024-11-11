exports.getPosts = (req, res, next) => {
    res.status(200).json( {
        posts: [{ title: 'first post' , content: 'this is first post in rest api'}]
    })
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    //create post in db
    //201=> success & created a resource
    console.log(title, content)
    res.status(201).json( {
        message: 'created',
        post: { id: 1, title: title, content: content}
    })
}