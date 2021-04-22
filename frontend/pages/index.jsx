import React, { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";

const fetcher = (url) => axios.get("/api/" + url).then((res) => res.data);

const Home = () => {
	const { data: todos, error } = useSWR("todos", fetcher);
	const [newTodoTitle, setNewTodoTile] = useState("");

	if (error) {
		return <div>Error...</div>;
	}

	if (todos) {
		return (
			<>
				<ul>
					{todos.map((todo) => (
						<li key={todo.id}>
							<input
								type="checkbox"
								checked={todo.done}
								onChange={() => {
									axios
										.patch("/api/todos/" + todo.id, {
											done: !todo.done,
										})
										.then(() => {
											mutate("todos");
										});
								}}
							/>
							<span
								style={{
									textDecoration: todo.done ? "line-through" : "none",
									color: todo.done ? "grey" : "black",
								}}
							>
								{todo.title}
							</span>
							<button
								onClick={() => {
									axios.delete("/api/todos/" + todo.id).then(() => {
										mutate("todos");
									});
								}}
							>
								del
							</button>
						</li>
					))}
				</ul>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						axios
							.post("/api/todos", {
								title: newTodoTitle,
							})
							.then(() => {
								mutate("todos");
								setNewTodoTile("");
							});
					}}
				>
					<input
						type="text"
						placeholder="title"
						value={newTodoTitle}
						onChange={(e) => setNewTodoTile(e.target.value)}
					/>
					<input
						type="submit"
						value="create"
						disabled={newTodoTitle.length === 0}
					/>
				</form>
			</>
		);
	}

	return <div>Loading...</div>;
};

export default Home;
