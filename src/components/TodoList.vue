<template>
<div>
  <h1>Vue.js + TypeScript TodoApp</h1>
  <label v-for="option in options" :key="option.value">
    <input type='radio'
      v-model="current"
      :value="option.value">
      {{option.label}}
  </label>
  （{{computedTodos.length}} 件を表示）
  <table>
    <thead>
      <tr>
        <th class="id">ID</th>
        <th class="comment">コメント</th>
        <th class="state">状態</th>
        <th class="button">-</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in computedTodos" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.comment}}</td>
        <td class="state">
          <button @click="doChangeState(item)">
            {{labels.get(item.state)}}
          </button>
        </td>
        <td class="button" @click.ctrl="doRemove(item)">
          <button>削除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <h2>新しい作業の追加</h2>
    <form class="add-form" @submit.prevent="doAdd">
      コメント <input type='text' ref="comment">
      <button type="submit">追加</button>
    </form>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TodoItem } from '@/types/todoItem.ts';
import { State } from '@/types/state';
import TodoStorage from '@/storage';

export default Vue.extend({
  created() {
    this.todos = TodoStorage.fetch();
  },
  data() {
    return {
      todos: [] as TodoItem[],
      options: [
        { value: State.All, label: 'すべて' },
        { value: State.Working, label: '作業中' },
        { value: State.Completed, label: '完了' },
      ],
      current: State.Working,
    };
  },
  methods: {
    doAdd() {
      const comment = this.$refs.comment as HTMLInputElement;
      if (!comment.value.length) {
        return;
      }
      this.todos.push({
        id: TodoStorage.uid++,
        comment: comment.value,
        state: State.Working,
      });
      comment.value = '';
    },
    doChangeState(item: TodoItem) {
      item.state = (item.state === State.Completed)
        ? State.Working
        : State.Completed;
    },
    doRemove(item: TodoItem) {
      const index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    },
  },
  watch: {
    todos: {
      handler(todos: TodoItem[]) {
        TodoStorage.save(todos);
      },
      deep: true,
    },
  },
  computed: {
    computedTodos(): TodoItem[] {
      return this.todos.filter((item) =>
        (this.current < 0) ? true : this.current === item.state,
      );
    },
    labels(): Map<State, string> {
      return new Map(this.options.map(
        (option) => [option.value, option.label] as [State, string]),
      );
    },
  },
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}
#app {
  max-width: 640px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  border-bottom: 2px solid #0099e4; /*#d31c4a */
  color: #0099e4;
}
th,
th {
  padding: 0 8px;
  line-height: 40px;
}
thead th.id {
  width: 50px;
}
thead th.state {
  width: 100px;
}
thead th.button {
  width: 60px;
}
tbody td.button, tbody td.state {
  text-align: center;
}
tbody tr td,
tbody tr th {
  border-bottom: 1px solid #ccc;
  transition: all 0.4s;
}
tbody tr.done td,
tbody tr.done th {
  background: #f8f8f8;
  color: #bbb;
}
tbody tr:hover td,
tbody tr:hover th {
  background: #f4fbff;
}
button {
  border: none;
  border-radius: 20px;
  line-height: 24px;
  padding: 0 8px;
  background: #0099e4;
  color: #fff;
  cursor: pointer;
}
</style>
