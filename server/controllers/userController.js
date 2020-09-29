const { User } = require('../models/index.js')
const { comparePassword } = require('../helpers/bcrypt.js')
const { signToken } = require('../helpers/jwt.js')

class UserController {
    static registerUser(req, res){
        let obj = {
            email : req.body.email,
            password: req.body.password
        }
        User.create(obj)
            .then(result => {
                res.status(201).json({
                    id: result.id,
                    email: result.email
                })
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }

    static async loginUser(req, res){
        const input = {
            email: req.body.email,
            password: req.body.password
        }
        try{
            const user = await User.findOne({
                where:{
                    email: input.email
                }
            })

            if(!user){
                res.status(401).json({
                    name: 'Unauthorized',
                    message: 'Wrong email or password!'
                })
            }
            else if(!comparePassword(input.password, user.password)) {
                res.status(401).json({
                    name: 'Unauthorized',
                    message: 'Wrong email or password!'
                })
            }
            else{
                const access_token = signToken({id:user.id, email: user.email})
                res.status(200).json({access_token})
            }
        }
        catch(err){
            res.status(500).json({message: err.message})
        }
    }
}

module.exports = UserController