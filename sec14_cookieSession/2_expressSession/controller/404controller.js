
exports.pageNotfound = (req, res, next) => {
    res.status(404).render('404/404', { pageTitle: 'Page Not Found',
      path: '404/404',
      isAuthenticated: req.session.isLoggedIn
    });
  }