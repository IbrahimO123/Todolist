<template>
  <main class="main">
    <h3>Todo List</h3>
    <div>
      <v-responsive class="mx-auto" max-width="270">
        <v-text-field
          v-model.trim="todo.title"
          type="text"
          label="New Task"
          placeholder="Add to list"
          @keydown.enter="addTask"
          variant="outlined"
          class="mt-2"
        ></v-text-field>
        <p class="text-red">
          <small>
            {{ error ? error : null }}
          </small>
        </p>
        <v-btn
          class="bg-black text-capitalize"
          @click="addTask"
          append-icon="mdi-receipt-text-plus"
        >
          Add Task
        </v-btn>
      </v-responsive>
    </div>
    <v-responsive v-if="todos.length > 0" class="mx-auto" max-width="350">
      <template v-for="(todo, index) in todos" :key="index">
        <div class="my-5">
          <div class="title">
            <span>{{ index + 1 }}.</span>
            <h5
              @click="todo.isCompleted ? null : editTask(todo.id)"
              :class="
                todo.isCompleted
                  ? 'mb-2 prevent-select text-decoration-line-through'
                  : 'mb-2 prevent-select'
              "
              :title="
                todo.isCompleted
                  ? 'Can not modify this task'
                  : 'Double click to modify'
              "
              :contenteditable="edit"
              @keydown.enter="updateTask(todo.id, $event)"
            >
              {{ todo.title }}
            </h5>
          </div>
          <template v-if="todo.isCompleted">
            <span>
              <v-btn
                @click="onCompeleted(todo.id)"
                append-icon="mdi-redo-variant"
                class="mr-3 text-capitalize"
                color="info"
                size="small"
                elevation="0"
                >Redo</v-btn
              >
            </span>
          </template>
          <template v-else>
            <span>
              <v-btn
                @click="onCompeleted(todo.id)"
                class="mr-3 text-capitalize"
                color="success"
                append-icon="mdi-progress-close"
                size="small"
                elevation="0"
                >Completed</v-btn
              >
            </span>
          </template>
          <span>
            <v-btn
              color="#F44336"
              mx="3"
              class="text-capitalize"
              size="small"
              @click="onDelete(todo.id)"
              append-icon="mdi-trash-can"
              elevation="0"
              >Delete</v-btn
            >
          </span>
        </div>
      </template>
    </v-responsive>
    <v-responsive class="my-4 text-center" v-else>
      <h3>No task to display ...</h3>
    </v-responsive>
    <v-icon color="secondary" @click="onShare"> mdi-share-variant </v-icon>
  </main>
  <v-snackbar
    timeout="3000"
    color="secondary"
    class="snackbar"
    v-model="snackbar"
  >
    Double tap(click) task to modify it
  </v-snackbar>
</template>
<script>
export default {
  name: "HomeView",
  data() {
    return {
      todo: {
        title: "",
        isCompleted: false,
      },
      snackbar: false,
      todos: [],
      error: "",
      edit: false,
      modifiedTask: "",
    };
  },
  mounted() {
    this.storedTasks();
  },
  methods: {
    addTask() {
      if (this.todo.title.trim() === "") {
        return (this.error = "Please enter a task");
      }
      const checkTaskExist = this.checkTaskExist(this.todo.title);
      if (checkTaskExist === true) {
        return (this.error = "Task already exists");
      } else {
        const checkingID = this.checkIdExist(this.todos);
        this.todos.push({
          id: checkingID ? this.maxID() : this.todos.length + 1,
          title: this.todo.title,
          isCompleted: this.todo.isCompleted,
        });
        this.error = null;
        this.todo.title = "";
        this.snackbar = true;
      }
    },
    maxID() {
      const res = Math.max(...this.todos.map((task) => task.id));
      return res + 1;
    },
    checkIdExist(todos) {
      const checking = todos.map((task) => {
        if (task.id === todos.length + 1) {
          return true;
        }
        return false;
      });
      return checking.some((task) => task === true);
    },
    checkTaskExist(title = "") {
      const checking = this.todos.map((task) => {
        if (task.title.toLowerCase() === title.toLowerCase()) {
          return true;
        }
        return false;
      });
      const resultOfCheck = checking.some((res) => res === true);
      return resultOfCheck;
    },
    editTask(id) {
      this.edit = true;
      const task = this.todos.find((t) => t.id == id);
      return task;
    },
    updateTask(id, event) {
      event.preventDefault();
      let res = this.editTask(id);
      res.title = event.target.innerText;
      this.todos.map((tasks) => {
        if (tasks.id === res.id) {
          return { ...tasks, title: res.title };
        } else return tasks;
      });
      this.edit = false;
    },
    storedTasks() {
      if (this.todos) {
        const storedAllTasks = JSON.parse(localStorage.getItem("Todo_List"));
        if (storedAllTasks) {
          return (this.todos = storedAllTasks);
        } else {
          return (this.todos = []);
        }
      }
    },
    onDelete(id) {
      this.todos = this.todos.filter((item) => item.id !== id);
    },
    onCompeleted(id) {
      this.edit = false;
      localStorage.setItem("Todo_List", JSON.stringify(this.todos));
      this.error = null;
      this.todo.title = "";
      this.error = null;
      const task = this.todos.find((t) => t.id === id);
      task.isCompleted = !task.isCompleted;
      this.todos.map((item) => {
        if (item.id === id) {
          return { ...item, isCompleted: task.isCompleted };
        }
        return item;
      });
    },
    onShare() {
      window.open("whatsapp://send?text=" + JSON.stringify(this.todos));
      // if (navigator.share) {
      //   navigator
      //     .share({
      //       title: "Todo List",
      //       text: "Todo List",
      //       url: "https://todo-list-vue.netlify.app/",
      //     })
      //     .then(() => console.log("Successful share"))
      //     .catch((error) => console.log("Error sharing", error));
      // } else {
      //   alert("Browser does not supported this API");
      // }
      console.log("Shared successfully....");
    },
  },
  watch: {
    todos: {
      handler() {
        if (this.todos) {
          localStorage.setItem("Todo_List", JSON.stringify(this.todos));
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap");
.main {
  border: 0.2px solid #000;
  font-family: "PT Sans Narrow", sans-serif;
  width: 35vw;
  max-width: 35vw;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 0.5px 0.5px 1px #000;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-self: center;
}
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.title {
  display: flex;
}
.snackbar {
  width: 350px;
  max-width: 350px;
  text-align: center;
  font-family: "PT Sans Narrow", sans-serif;
}
h5 {
  margin-left: 5px;
  width: 200px;
  font-size: 15px;
}
h5:focus {
  outline: 0.3px solid #000;
  padding: 3px;
  padding-left: 5px;
}
@media screen and (max-width: 1000px) {
  .main {
    width: 80vw;
    max-width: 80vw;
  }
}
</style>
