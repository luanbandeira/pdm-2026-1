import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "8FjrKkSgxsY30efOhRoEAzo0UtA1tPgtPlGlKzAv",
  "X-Parse-JavaScript-Key": "7XFcwyHA1fHBqoUyQcmJTgqfPBloT2Tnk4yIFVZS",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, {
    headers: headers,
  });
  return response.data.results;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}
export async function atualizarTarefa(objectId, dados) {
  const response = await axios.put(`${urlBase}/${objectId}`, dados, {
    headers: headersJson,
  });
  return response.data;
}

export async function deletarTarefa(objectId) {
  const response = await axios.delete(`${urlBase}/${objectId}`, {
    headers: headers,
  });
  return response.data;
}