const userCtrl = {};

const passport = require('passport');

const user = require('../models/user');

userCtrl.renderSingUpForm = (req, res) => {
    res.render('users/signup');
};
userCtrl.signup = async (req, res) => {
    const errors = [];
    const {name ,email ,password, confirm_password } = req.body;
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4){
        errors.push({text: "La contraseña no puede tener menos de 4 caracteres"});
    }
    if(errors.length > 0){
        res.render('users/signup' ,{
            errors,
            name,
            email
        })
    } else {
        const emailUser = await user.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'La cuenta de correo ya esta en uso');
            res.redirect('/users/signup');
        }else {
            const newUser = new user({name, email, password});
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save();
            req.flash('success', 'El usuario se ha registrado');
            res.redirect('/users/signin');
        }
    }
};
userCtrl.renderSingInForm = (req, res) => {
    res.render('users/signin');
};

userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/notes',
    failureFlash: true
});

userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success','Cerraste sesion');
    res.redirect('/users/signin');
};
module.exports = userCtrl;