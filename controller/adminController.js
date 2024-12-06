const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');

const saltRounds = 10; // Add this for hashing passwords

const loadLogin = (req, res) => {
    res.render('admin/login');
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) return res.render('admin/login', { message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.render('admin/login', { message: 'Invalid Credentials' });

        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.send(error);
    }
};

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) return res.redirect('/admin/login');

        const users = await userModel.find({});
        res.render('admin/dashboard', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Function to handle user editing
const edituser = async (req, res) => {
    try {
        const { email, password, id } = req.body;

        if (!password) {
            return res.status(400).send('Password is required');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userModel.findOneAndUpdate(
            { _id: id },
            { email: email, password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        const allusers = await userModel.find({});
        return res.render('admin/dashboard', { users: allusers });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

// Function to handle user deletion
const deleteuser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const allusers = await userModel.find({});
        return res.render('admin/dashboard', { users: allusers });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

// Function to handle adding a new user
const adduser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();

        const allusers = await userModel.find({});
        return res.render('admin/dashboard', { users: allusers });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

// Function to handle admin logout
const logout = async (req, res) => {
    try {
        req.session.admin = null;
        return res.redirect('/admin/login');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

// Function to handle user search
const searchuser = async (req, res) => {
    try {
        const { search } = req.body;

        const users = await userModel.find({ email: { $regex: search, $options: 'i' } });
        return res.render('admin/dashboard', { users });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

module.exports = { loadLogin, Login, loadDashboard, searchuser, logout, adduser, deleteuser, edituser };
 