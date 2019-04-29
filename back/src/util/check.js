const User = require('../model/User');


module.exports = {
    checkSuscribe(req) {
        return new Promise((resolve, reject) => {
            req.checkbody('username', 'Login: 3 to 30 character needed').matches(/^[a-z0-9]{2,50}$/i).notEmpty();
            req.checkbody('firstname', 'Firstname: 2 to 30 character needed').notEmpty().matches(/^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i);
            req.checkbody('lastname', 'Lastname: 2 to 30 character needed').notEmpty().matches(/^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i);
            req.checkbody('email', 'Email Invalid').matches(/^[a-z0-9._%+-]{1,64}@[a-z0-9._-]+\.[a-z]{2,255}$/i).notEmpty();
            req.checkbody('password', 'Password Invalid').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/).notEmpty();

            let errors = req.validationErrors();
            if (errors) {
                resolve({status: 'error', data: errors});
            } else {
                resolve({status: 'success'});
            }
        });
    },

    checkUserExists(username, email) {
        return new Promise((resolve, reject) => {
            User.findOne({$or: [{username: username}, {email: email}]}, function (err, user) {
                if (user) {
                    reject({status: 'error', data: [{msg: 'This username/email already exists'}]});
                } else {
                    resolve({status: 'success'});
                }
            })
        });
    },

    getPassw(username) {
        return new Promise((resolve, reject) => {
            User.findOne({username: username}, function (err, user) {
                if (user) {
                    resolve({status: 'success', data: user});
                } else {
                    reject({status: 'erreur'});
                }
            })
        });
    },

}
