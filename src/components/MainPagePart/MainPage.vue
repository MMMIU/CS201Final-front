<template>
<div class="MainPage">
  <div class="circle leftCircle"></div>
  <div class="circle rightCircle"></div>

</div>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style scoped>
.MainPage{
  width: 100%;
  height: 100%;
}
.circle{
  width: 500px;
  height: 500px;
  background-color: #3a8ee6;
  border-radius: 50%;
}
.leftCircle{
  float: left;
  margin-left: 100px;
}
.rightCircle{
  float: right;
  margin-right: 100px;
}
</style>
