import bcrypt from 'bcrypt';
const saltRounds = 10

let hashpassword = (myPlaintextPassword) => {
    let salt = bcrypt.genSaltSync(saltRounds)
    let hash = bcrypt.hashSync(myPlaintextPassword, salt)
    return hash
}


let comparePassword = (oldPassword, hashpassword, cb) => {
    bcrypt.compare(oldPassword, hashpassword, (err, res) => {
        if (err) {
            console.log(err.message, 'Comparison Error')
            cb(err, null)
        } else {
            cb(null, res)
        }
    })
}


let comparePasswordSync = (myPlaintextPassword, hash) => {
    return bcrypt.compareSync(myPlaintextPassword, hash)
}

export default {
    hashpassword: hashpassword,
    comparePassword: comparePassword,
    comparePasswordSync: comparePasswordSync
}
