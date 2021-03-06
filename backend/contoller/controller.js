const db = require('../config/db.config');
const config = require('../config/config');
const User = db.user;
const Role = db.role;
 
const Op = db.Sequelize.Op;
 
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
 
exports.signup = (req, res) => {
	// Save User to Database
	console.log("Processing func -> SignUp");
	
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findAll({
		  where: {
			name: {
			  [Op.or]: req.body.roles
			}
		  }
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.json({"message":"User registered successfully!"});
            });
		}).catch(err => {
			res.json("Error -> " + err);
		});
	}).catch(err => {
		res.json("Fail! Error -> " + err);
	})
}
 
exports.signin = (req, res) => {
	console.log("Sign-In");
	
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.json({"message":'User Not Found.'});
		}
 
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.json({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		
		var token = jwt.sign({ id: user.id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		
		res.json({ auth: true, accessToken: token });
		
	}).catch(err => {
		res.json('Error -> ' + err);
	});
}
 
exports.userContent = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.json({
			"description": "User Content Page",
			"user": user
		});
	}).catch(err => {
		res.json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}
 
exports.adminBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.json({
			"description": "Admin Board",
			"user": user
		});
	}).catch(err => {
		res.json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}
 
exports.managementBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.json({
			"description": "Management Board",
			"user": user
		});
	}).catch(err => {
		res.json({
			"description": "Can not access Management Board",
			"error": err
		});
	})
}