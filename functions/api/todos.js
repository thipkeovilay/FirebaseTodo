const { db } = require("../utils/admin");

exports.getAllTodos = async (req, res) => {
  // .collection(), .orderBy(), .get() are all FIRESTORE METHODS
  try {
    const snapshot = await db
      .collection("todos")
      .orderBy("createdAt", "desc")
      .get();

    const todos = [];

    snapshot.forEach((doc) => {
      todos.push({
        todoId: doc.id,
        // the .data() is a FIRESTORE METHOD that reveals the data for each document
        title: doc.data().title,
        description: doc.data().description,
        createdAt: doc.data().createdAt,
      });
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: err.code });
  }
};

exports.postOneTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json("Title must not be empty");

    if (!description)
      return res.status(400).json("Description must not be empty");

    const todo = await db.collection("todos").add({
      title: title,
      description: description,
      createdAt: new Date().toISOString(),
    });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
