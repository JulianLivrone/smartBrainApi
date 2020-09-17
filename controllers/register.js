const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password); //we hash the password
        db.transaction(trx => { //when we want to make multiple changes in the database we use transaction because if one change fail it all fails and we don't have inconsistencies.
            trx.insert({ //trx is the default for transaction
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit) //if all pass, then commit send this transaction through
            .catch(trx.rollback) //in case anything fails we roll back the changes.
        })
    .catch(err => res.status(400).json(err))
}

module.exports = {
    handleRegister: handleRegister
};