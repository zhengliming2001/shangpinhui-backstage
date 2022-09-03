<template>
  <div class="dashboard-container">
      <Card/>
      <Sale/>
      <Observe/>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    Card,
    Sale,
    Observe
  }
}
</script>

<style>
*{
  margin: 0;
  padding:0;
}
</style>
