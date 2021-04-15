<template>
  <div class="backgroundStars">
    <div id="starsContainer">
      <div v-for="item in numOfStars" class="star" :key="item" ref="star" :style="{animationDelay: Math.random() * 1.5 + 's', transform: 'scale('+ Math.random() * 1.5+')'}"></div>
      <!--      :style="{marginLeft: Math.random() * 100 + '%', marginTop: Math.random() * Math.random() * 80 + '%', animationDelay: Math.random() * 1.5 + 's', transform: 'scale('+ Math.random() * 1.5+')'}"-->
    </div>
  </div>
</template>
<script>
export default {
  name: 'backgroundStars',
  data () {
    return {
      numOfStars: 800,
      distance: 800
    }
  },
  mounted () {
    let starArr = this.$refs.star
    starArr.forEach(item => {
      let speed = 0.2 + Math.random()
      let thisDistance = this.distance + (Math.random() * 300)
      item.style.transformOrigin = `0 0 ${thisDistance}px`
      item.style.transform = `
      translate3d(0, 0, -${thisDistance}px)
      rotateY(${(Math.random() * 360)}deg)
      rotateX(${(Math.random() * -50)}deg)
      scale(${speed}, ${speed})`
    })
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
@keyframes rotate {
  0% {
    transform: rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

#starsContainer {
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 50%;
  animation: rotate 100s infinite linear;
  transform: rotateZ(0deg) rotateX(-40deg) rotateY(0);
  bottom: 20%;
}
.star {
  width: 2px;
  height: 2px;
  background: #f7f7b8;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  animation: flash 1s alternate infinite;
}
@keyframes flash {
  0%{opacity: 0;}
  100%{opacity: 1;}
}
</style>
