<script setup lang="ts">
import { inject } from "vue";
import {
  INJECTION_KEY,
  useCreateSingleContainerService,
} from "./createSingleContainerService";

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const {
  name,
  coursesString,
  cuisinesString,
  tagsString,
  servingAmount,
  servingName,
  sourceUrl,
  ingredientsString,
  instructionsString,
  add,
} = inject(INJECTION_KEY, useCreateSingleContainerService)();
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-name" class="font-semibold w-36">Name</label>
        <InputText id="rc-name" v-model="name" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-courses" class="font-semibold w-36">Course(s)</label>
        <InputText id="rc-courses" v-model="coursesString" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-cuisines" class="font-semibold w-36">Cuisine(s)</label>
        <InputText
          id="rc-cuisines"
          v-model="cuisinesString"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-tags" class="font-semibold w-36">Tag(s)</label>
        <InputText id="rc-tags" v-model="tagsString" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-serving-amount" class="font-semibold w-36"
          >Serving Amount</label
        >
        <InputNumber
          id="rc-serving-amount"
          v-model="servingAmount"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-serving-name" class="font-semibold w-36"
          >Serving Name</label
        >
        <InputText
          id="rc-serving-name"
          v-model="servingName"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-source-url" class="font-semibold w-36">Source URL</label>
        <InputText id="rc-source-url" v-model="sourceUrl" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-ingredients" class="font-semibold w-36"
          >Ingredients</label
        >
        <Textarea
          id="rc-ingredients"
          v-model="ingredientsString"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="rc-instructions" class="font-semibold w-36"
          >Instructions</label
        >
        <Textarea
          id="rc-instructions"
          v-model="instructionsString"
          class="flex-auto"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <Button label="Add" @click="add" />
      </div>
    </template>
  </Card>
</template>
