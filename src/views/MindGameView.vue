<script setup lang="ts">
import { useSettings } from "@/composables/settings"
import { shuffle } from "@/helpers/array"
import { ref } from "vue"

const { settings, editableSettings, updateSettings, afterUpdate } = useSettings(
  {
    id: "mind-game",
    defaultSettings: {
      row: 3,
      column: 2,
      occurences: 2,
    },
    validateEach: {
      column: {
        valid: (value) => value >= 2,
        message: "Column must be at least 2",
      },
      row: {
        valid: (value) => value >= 2,
        message: "Row must be at least 2",
      },
      occurences: {
        valid: (value) => value >= 2,
        message: "Occurences must be at least 2",
      },
    },
    validateAll: {
      valid: (settings) =>
        settings.column * settings.row >= settings.occurences,
      message: "Column * Row must be at least Occurences",
    },
  }
)

let board = ref<number[][] | null>(null)

const generateBoard = () => {
  const { row, column, occurences } = settings.value

  const array = Array.from({ length: row }, () =>
    Array.from({ length: column }, () => 0)
  )

  const numbers = []
  for (let i = 0; i < row * column; i++) {
    numbers.push(Math.floor(i / occurences) + 1)
  }

  shuffle(numbers)

  for (let i = 0; i < numbers.length; i++) {
    array[Math.floor(i / column)][i % column] = numbers[i]
  }

  return array
}

const found = ref<number[]>([1])
const selected = ref<{ x: number; y: number }[]>([])

afterUpdate(() => {
  board.value = generateBoard()
  found.value = []
  selected.value = []
})

const selectCellAt = (row: number, column: number) => {
  const { occurences } = settings.value

  const index = selected.value.findIndex(
    (cell) => cell.x === row && cell.y === column
  )

  if (index === -1) {
    selected.value.push({ x: row, y: column })
  } else if (
    board.value![row][column] !==
    board.value![selected.value[index].x][selected.value[index].y]
  ) {
    selected.value = []
    return
  } else selected.value.splice(index, 1)

  if (selected.value.length === occurences) {
    const number = board.value![selected.value[0].x][selected.value[0].y]
    if (
      selected.value.every((cell) => board.value![cell.x][cell.y] === number)
    ) {
      found.value.push(number)
    }
    selected.value = []
  }
}
</script>

<template>
  <main>
    <h1>Mind Game</h1>
    <div>
      <h2>Settings</h2>
      {{ settings }}
      <form @submit.prevent="updateSettings(editableSettings)">
        <div class="input-group">
          <label for="row">Row</label>
          <input
            type="number"
            id="row"
            v-model.number="editableSettings.row"
            min="1"
            max="10"
          />
        </div>
        <div class="input-group">
          <label for="column">Column</label>
          <input
            type="number"
            id="column"
            v-model.number="editableSettings.column"
            min="1"
            max="10"
          />
        </div>
        <div class="input-group">
          <label for="occurences">Occurences</label>
          <input
            type="number"
            id="occurences"
            v-model.number="editableSettings.occurences"
            min="2"
            max="5"
          />
        </div>
        <button type="submit">Update settings</button>
      </form>
    </div>
    <div>
      <h2>Board</h2>
      <div v-if="board" class="board">
        <div class="row" v-for="(row, i) of board" :key="`row-${i}`">
          <div
            class="cell"
            v-for="(number, j) in row"
            :key="`col-${j}`"
            @click="selectCellAt(i, j)"
          >
            <template
              v-if="
                found.includes(number) ||
                selected.some((s) => s.x === i && s.y === j)
              "
              >{{ number }}</template
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  .input-group {
    display: flex;
    gap: 0.25rem;

    input[type="number"] {
      width: 3rem;
    }
  }
}

.board {
  display: inline-flex;

  .cell {
    text-align: center;
    padding: 0.75rem;
    border: 1px solid black;
    width: 3rem;
    height: 3rem;

    &:hover {
      background-color: rgb(65, 215, 226);
    }
  }
}
</style>
