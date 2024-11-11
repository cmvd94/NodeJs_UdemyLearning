app.post('/logout', (req, res) => {
    if (!req.session) {
        // Session doesn't exist
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out.' });
        }
        res.clearCookie('session_i;d')
        res.redirect('/login');
    });
});
//////////////////////////////////////////////////////////////////////