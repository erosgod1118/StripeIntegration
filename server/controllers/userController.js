const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectId;

const { issueToken, authorize, Roles } = require("../utils/authUtils");

const db = require("../model/db");

exports.registerUser = async function (req, res) {
    const { email, password, role, name } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const insertData = { name, email, password: hashedPassword, role, isActive: false };
    
    const usersCollection = await db.getDB().collection("users");
    usersCollection.createIndex({ email: 1 }, { unique: true });

    try {
        const result = await usersCollection.insertOne(insertData);
        const newUser = { _id: result.insertedId, email, name, role };
        const token = issueToken(newUser);
        
        return res.status(200).json({ ...newUser, token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Error: Duplicated email detected" });    
        }
        return res.status(400).json({ message: "Error: Could not add user" });
    }
}

exports.loginUser = async function (req, res) {
    const { email, password } = req.body;
    const query = { email };

    const usersCollection = await db.getDB().collection("users")
    
    try {
        const foundUser = await usersCollection.findOne(query);
        if (!foundUser) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const hashedPassword = foundUser.password;
        let isPasswordCorrect;

        try {
            isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
            console.log(isPasswordCorrect);
        } catch (errBcrypt) {
            console.log(errBcrypt);
            return res.status(400).json({ message: "Error: Could not get user password" });
        }

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const user = foundUser;
        delete user.password;

        const token = issueToken(user);
        return res.status(200).json({ ...user, token });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error: Could not get user details" });
    }
}

exports.getUserProfile = async function (req, res) {
    const query = { _id: new ObjectID(req.user._id) };

    const usersCollection = await db.getDB().collection("users");
    const foundUser = await usersCollection.findOne(query);

    try {
        return res.status(200).json(foundUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error: Could not get user profile" });
    }
}

exports.updateUserStatus = async function (req, res) {
    const { userId, isActive } = req.body;

    var query;
    try {
        query = { _id: new ObjectID(userId) };
    } catch (err) {
        return res.status(400).json({ message: "Error: Could not set ObjectID" });
    }
     
    const patchData = { $set: { isActive } };

    const usersCollection = await db.getDB().collection("users");

    try {
        await usersCollection.updateOne(query, patchData);
        return res.status(200).json({ message: "User data updated" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error: Could not update" });
    }
}

exports.logoutUser = function (req, res) {
    if (req.session != undefined) {
        req.session.destroy()
    }

    res.clearCookie('connect.sid')
    
    return res.status(200).json({ message: "Successfully logged out" })
}