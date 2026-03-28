import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adicionarTarefa, atualizarTarefa, deletarTarefa, getTarefas } from "@/back4app";

export default function TarefasPage() {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const mutation = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const mutationAtualizar = useMutation({
    mutationFn: ({ objectId, dados }) => atualizarTarefa(objectId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const mutationDeletar = useMutation({
    mutationFn: deletarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const [descricao, setDescricao] = useState("");

  async function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    mutation.mutate({ descricao, concluida: false });
    setDescricao("");
  }

  function handleToggleConcluida(objectId, valorAtual) {
    mutationAtualizar.mutate({ objectId, dados: { concluida: !valorAtual } });
  }

  function handleDeletar(objectId) {
    Alert.alert("Excluir tarefa", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => mutationDeletar.mutate(objectId),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {(isFetching || mutation.isPending) && <ActivityIndicator size="large" />}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutation.isPending}
      />
      <View style={styles.hr} />
      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <View key={t.objectId} style={styles.taskRow}>
            <Text style={[styles.taskText, t.concluida && styles.strikethroughText]}>
              {t.descricao}
            </Text>
            <Switch
              value={t.concluida}
              onValueChange={() => handleToggleConcluida(t.objectId, t.concluida)}
            />
            <TouchableOpacity
              style={styles.btnDelete}
              onPress={() => handleDeletar(t.objectId)}
            >
              <Text style={styles.btnDeleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tasksContainer: {
    width: "100%",
    paddingLeft: 15,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "red",
  },
  btnDelete: {
    paddingHorizontal: 8,
  },
  btnDeleteText: {
    fontSize: 20,
  },
});