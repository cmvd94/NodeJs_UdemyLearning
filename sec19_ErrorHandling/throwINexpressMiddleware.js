//express middle recognize throw error in sync code. in asyc code if throw is used express unable to find
app.use((req, res, next) => {
  //Eg: here it is normal function.
  //throw new Error() //works.. throw is sent to express error middleware
  if (req.session && req.session.userId) {
    UserModel.findById(req.session.userId)
      .then( user => {
        //then is asyc so throw will throw error to catch alone.
        //throw will not handled
        if (user) {
          req.user = user;
          next();
        } else {
          next(new Error('Could not restore User from Session.'));
        }
      })
      .catch(err => {
        //throw will come here.
        // if express should handle here then use next
        next(new Error(err))//now in asyc express middle take charge
      })
  } else {
    next();
  }
});

app.use((error, req, res, next) => {
  res.redirect('/500');
})