<template>
  <div class="backgroundStars">
    <div id="starsContainer">
      <div v-for="item in numOfStars" class="star" :key="item"
      :style="{marginLeft: Math.random() * 100 + '%', marginTop: Math.random() * Math.random() * 80 + '%', animationDelay: Math.random() * 1.5 + 's', transform: 'scale('+ Math.random() * 1.5+')'}"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'backgroundStars',
  data () {
    return {
      numOfStars: 100
    }
  }
}
</script>

<style scoped>
.backgroundStars{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  background: radial-gradient(220% 105% at top center, #1b2947 10%, #75517d 40%, #e96f92 65%, #f7f7b6);
  overflow: hidden;
}

#starsContainer{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.star{
  width: 2px;
  height: 2px;
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: flash 1s alternate infinite;
}

@keyframes flash {
  0%{opacity: 0;}
  100%{opacity: 1;}
}
</style>
