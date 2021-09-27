import { Router } from 'express';

import { User } from '../models/User.js';

const userRouter = Router();

/**
 * Util func to make sure input is correct format
 */
const isValidUser = (user) => {
	return (user.email && user.username && user.password);
};


/**
 * Signup
 */
userRouter.post('/signup', async (req, res) => {

	let user = req.body;

	if (!isValidUser(user)) {
		res.status(400).send('The object structure of this user was invalid!');
		return;
	}

	let userDoc;

	try {

		userDoc = await User.findOne({ username: user.username }).exec();

		if (userDoc) {
			res.status(400).send('This username is taken!');
			return;
		}

		userDoc = await new User(user).save();

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend.');
		return;
	}

	res.status(200).send({
		_id: userDoc._id,
		msg: 'User signup successful!'
	});

});

/**
 * Login
 */
userRouter.get('/login', async (req, res) => {
	let user = req.body;

	if (!user || !user.username) {
		res.status(400).send('You must send in the username!');
		return;
	}

	let userDoc;
	try {

		userDoc = await User.findOne({ username: user.username }).exec();

		if (!userDoc) {
			res.status(400).send('This user does not exist!');
			return;
		}

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occurred on the backend.');
		return;
	}

	res.status(200).send({
		_id: userDoc._id,
		darkModeStatus: userDoc.darkModeStatus
	});

});

/**
 * Update user account after editing
 * Garrett Lee
 */
 userRouter.post('/updateUser', async (req, res) => {

    let user = req.body;
  
    // validate user
    if (!isValidUser(user)) {
        res.status(400).send("The object structure of the user was invalid");
        return;
    }
  
    let userDocument;
  
    try {

        // todo: find and update by ID incase username changes
        // todo: make sure new username doesn't already exist
        // todo: find and update?
        await User.updateOne({username: user.username}, {bio: user.bio});

        userDocument = await User.findOne({username: user.username})
        
    } catch (e) {
        console.error(e);
        res.status(400).send("Error updating user");
        return;
    }
  }); 
  
  /**
   * Retrieve user information
   * Garrett Lee
   */
  userRouter.get('/getUser', async (req, res) => {
    let user = req.body;

    if (!user || !username) {
        res.status(400).send('User does not exist');
        return;
    }

    let userDoc;

    try {
        userDoc = await User.findOne({username: user.username}).exec();

    } catch (e) {
        console.error(e);
        res.status(400).send('Error fetching user');
    }

    res.status(200).send({
		_id: userDoc._id,
        username: userDoc.username,
        bio: userDoc.bio,
		darkModeStatus: userDoc.darkModeStatus
	});


  });
  
  /**
   * Endpoint to delete account/all posts and references
   * Garrett Lee
   */
  userRouter.delete('/deleteAccount', async (req, res) => {
  
  });

export { userRouter };