const { db } = require("../utils/admin");
const config = require("../config");
const firebase = require("firebase");

firebase.initializeApp(config);

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const token = await data.user.getIdToken();

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(403).json({ general: "wrong credentials, please try again" });
  }
};

exports.signUpUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(
        email.toLowerCase(),
        password.toLowerCase()
      );

    const userId = data.user.uid;
    const token = await data.user.getIdToken();

    // make object of fields we'd like to add to the user documents in Firestore
    // Create a user in the users collection in Firestore
    await db.doc(`/users/${name}`).set({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      userId,
    });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      res.status(400).json({ email: "Email already in use" });
    } else {
      res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    }
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await firebase.auth().sendPasswordResetEmail(email);

    res.json("email sent");
  } catch (error) {
    res.json(error);
  }
};
