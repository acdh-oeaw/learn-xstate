<script setup lang="ts">
import { useMachine } from '@xstate/vue';
import { createBrowserInspector } from '@statelyai/inspect';
import {formviewMachine} from "./formviewMachine.ts";

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(formviewMachine, {
  inspect
});
</script>

<template>
  <div class="formlist pa-3">
    <v-switch
        v-model="snapshot.context.simpleformactive"
        @click="send({ type: 'toggleForm' })"
    />
    <v-data-table
        v-if="snapshot.context.itemsprops"
        :items="snapshot.context.items"
        class="elevation-1"
    >
      <template #body="{ items }">
        <tbody>
        <tr
            v-for="(item, index) in items"
            :key="item.name"
        >
          <td
              v-for="header in Object.keys(snapshot.context.itemsprops)"
              :key="header"
          >
            <template v-if="typeof item === 'object' && item[header] && item[header].name">
              {{ item[header].name }}
            </template>
            <template v-else>
              {{ item[header] }}
            </template>
          </td>
          <td >
            <v-btn
                small
                class="mr-2"
                @click="send({ type: 'editItem', value: index })"
            >
              edit
            </v-btn>
            <v-btn
                small
                @click="send({ type: 'removeItem', value: index })"
            >
              delete
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>

</style>
