const express = require("express");
const { Client } = require("pg");
var bodyParser = require("body-parser");
var cors = require("cors");

(async function () {
	const app = express();

	app.use(bodyParser.json());
	app.use(cors());

	const client = new Client({
		host: "localhost",
		port: 5432,
		database: "todo",
		user: "todo",
		password: "todo",
	});
	await client.connect();

	// const res1 = await client.query(
	// 	`INSERT INTO todos (title) VALUES ('MOGGERS')`
	// );

	app.get("/api/todos", async (req, res) => {
		const { rows } = await client.query("SELECT * FROM todos ORDER BY id ASC");
		return res.send(rows);
	});

	app.post("/api/todos", async (req, res) => {
		const {
			rows,
		} = await client.query(
			"INSERT INTO todos (title) VALUES ($1) RETURNING *",
			[req.body.title]
		);
		res.send(rows[0]);
	});

	app.get("/api/todos/:id", async (req, res) => {
		const { rows } = await client.query("SELECT * FROM todos WHERE id = $", [
			req.params.id,
		]);
		return res.send(rows[0]);
	});

	app.patch("/api/todos/:id", async (req, res) => {
		const r = await client.query("SELECT * FROM todos WHERE id = $1", [
			req.params.id,
		]);
		let todo = r.rows[0];

		if (req.body.title !== undefined) {
			todo.title = req.body.title;
		}

		if (req.body.done !== undefined) {
			todo.done = req.body.done;
		}

		const {
			rows,
		} = await client.query(
			"UPDATE todos SET title = $1, done = $2 WHERE id = $3 RETURNING *",
			[todo.title, todo.done, req.params.id]
		);
		res.send(rows[0]);
	});

	app.delete("/api/todos/:id", async (req, res) => {
		await client.query("DELETE FROM todos WHERE id = $1", [req.params.id]);
		res.end();
	});

	app.listen(8080, () => console.log("server started"));
})();
