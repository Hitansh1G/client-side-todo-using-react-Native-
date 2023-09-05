import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const COLORS = { primary: '#000000', white: '#ffffff' };

const App = () => {
  const [inputValue, setInputValue] = React.useState('');

  const [todos, setTodos] = useState([]);
  
  const getTodos = async () => {
    try {
      const response = await axios.get('http://192.168.50.245:8000/todo/');
      const data = response.data; 
      console.log(data)
      setTodos(data); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos(); // Call getTodos when the component mounts
  }, []);

  const ListItem = ({todo})=>{
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }} >
          <Text>{todo?.Todo}</Text>
        </View>
        {
          todo?.completed ? <Icon name="check" size={25} color="green" /> : <Icon name="close" size={25} color="red" />
        }

        <TouchableOpacity style={[styles.actionIcon]} onPress={() => markTodoComplete(todo?.id)} > 
          <Icon name="check" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionIcon]} onPress={() => deleteTodo(todo?.id)} > 
          <Icon name="trash" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  

  const addTodo = () => {
    if (inputValue === '') {
      Alert.alert('Please enter a task', 'Input todo');
    } else {
      const newTodo = {
        Todo: inputValue,
        completed: false,
      };
      console.log(newTodo);
      axios.post('http://192.168.50.245:8000/todo1', newTodo)
        .then((response) => {
          const createdTodo = newTodo;
          console.log(createdTodo);
          const currentTodos = [...todos];
          currentTodos.push(createdTodo);
          console.log(currentTodos);
          setTodos([...currentTodos]);
          setInputValue('');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', 'Failed to add todo');
        });
    }
  };
  
  
  


  const markTodoComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        console.log(`Todo ${id} updated as completed: ${todo.completed}`);
        axios.put(`http://192.168.50.245:8000/todo/${id}`, { completed: todo.completed })
          .then(() => {
            console.log(`Todo ${id} updated as completed: ${todo.completed}`);
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', `Todo ${id} Failed to update todo`);
          });
      }
      return todo;
    });
  
    setTodos(updatedTodos);
  };
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.50.245:8000/todo/${id}`);
      if (response.status === 200) {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
        console.log('Todo deleted successfully');
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // // // setTodos([]);
  const clearAlltodos = () => {
    console.log('Clearing all todos');
    axios.delete('http://192.168.50.245:8000/todo/clear-all')
    .then(() => {
      console.log('All todos cleared');
      setTodos([]); 
    })
    .catch((error) => {
      console.error(error);
      Alert.alert('Error', 'Failed to clear all todos');
    });
  }
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 25, color: COLORS.primary, marginVertical: 15 }}>
          Todo Application
        </Text>
        <Icon name="list" size={40} color="red"  />
      </View>

      <View style={styles.listContainer}>
        <FlatList 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding:20 , paddingBottom:100}}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem todo={item} />}

        />
      </View>

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
        <TextInput 
          placeholder="ADD TODO TASK" 
          value={inputValue} 
          onChangeText={(text) => setInputValue(text)} 
        />

        </View>
        <TouchableOpacity onPress={addTodo} >
          <View style={styles.iconContainer}>
            <Icon name="plus" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionIcon: {
    height: 50,
    width: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius:7,
    marginVertical: 10, 
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
