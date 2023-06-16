<template>
  
</template>

<script setup>
import { ref } from 'vue';

const menu1Value = ref('item2');

const changeHandler = (active) => {
  console.log('change', active);
};
</script>


