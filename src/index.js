const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIfExistsRepository(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }
  console.log(repositories)
  request.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", checkIfExistsRepository, (request, response) => {
  console.log(repositories)
  let { repository } = request;
  const { title, url, techs } = request.body;
  console.log(repository)
  repository = { ...repository, title, url, techs };

  return response.json(repository);
});

app.delete("/repositories/:id", checkIfExistsRepository, (request, response) => {
  const { repository } = request;
  const index = repositories.findIndex((repo => repository.id === repo.id))
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfExistsRepository, (request, response) => {
  let { repository } = request;
  const likes = ++repository.likes;

  return response.json({ likes });
});

module.exports = app;
