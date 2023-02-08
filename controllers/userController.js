const { compare } = require('bcryptjs');
const { createToken } = require('../helpers/jwt');
const { User } = require('../models')
const midtransClient = require('midtrans-client')
class UserController {

    static async registerUser(req, res, next) {
        try {
            console.log(req.body);
            let { username, email, password } = req.body
            let data = User.create({
                username, email, password, role: 'User', payment: 'NonMember'
            })
            res.status(201).json({ data })
        } catch (error) {
            next(error)
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body
            console.log(req.body);
            let user = await User.findOne({
                where: { email }
            })
            if (!user) {
                throw {
                    name: 'InvalidCredentials'
                }
            } else {
                let comparePass = compare(password, user.password)
                if (!comparePass) {
                    throw { name: 'InvalidCredentials' }
                } else {
                    let { id, email, role } = user
                    let access_token = createToken({
                        id, email, role
                    })
                    res.status(200).json({
                        access_token, username: user.username,
                         payment: user.payment
                    })
                }
            }
        } catch (error) {
            next(error)
        }
    }

    static async fetchLoginUser(req, res, next) {
        try {
            const user = await User.findAll({
                where: { username: req.user.username}
            })
            res.status(200).json(user)
        } catch (error) {
            console.log(error);
        }
    }

    static async midtransToken(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id)
  
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: 'SB-Mid-server-ZQU4wWb0ZkWhko2QA8_bZZGZ'
      });
  
      let parameter = {
        transaction_details: {
          order_id: "YOUR-ORDERID-" + Math.floor(1000000 + Math.random() * 9000000),
          gross_amount: 100000
        },
        credit_card: {
          "secure": true
        },
        customer_details: {
          email: user.email,
        }
      };
  
      const midtransToken = await snap.createTransaction(parameter)
      res.status(200).json(midtransToken);
      
  
    } catch (error) {
      next(error)
    
    }
  }

  static async updateStatus(req, res, next) {
    try {
        const {username}  = req.user

        const update = await User.update({ payment: 'Member' }, { where: { username } })
        res.status(200).json({message: "Updated"})
    } catch (error) {
        console.log(error);
    }
}


}

module.exports = UserController