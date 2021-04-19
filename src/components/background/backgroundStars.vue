<template>
  <div class="backgroundStars">
    <div id="starsContainer">
      <div v-for="item in numOfStars" class="star" :key="item" ref="star" :style="{animationDelay: Math.random() * 1.5 + 's', transform: 'scale('+ Math.random() * 1.5+')'}"></div>
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
      let scale = 0.2 + Math.random()
      let starDistance = this.distance + (Math.random() * 300)
      item.style.transformOrigin = `0 0 ${starDistance}px`
      item.style.transform = `
      translate3d(0, 0, -${starDistance}px)
      rotateY(${(Math.random() * 360)}deg)
      rotateX(${(Math.random() * -60)}deg)
      scale(${scale})`
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
  background: radial-gradient(220% 105% at top center, black 20%, #409AFF 50%, #0000BF 85%, #080BBF);
  overflow: hidden;
}
@keyframes rotate {
  0% {
    transform: rotateZ(0deg) rotateX(40deg) rotateY(0);
  }
  100% {
    transform: rotateZ(0deg) rotateX(40deg) rotateY(-360deg);
  }
}

#starsContainer {
  transform-style: preserve-3d;
  position: absolute;
  left: 50%;
  animation: rotate 200s infinite linear;
  top: 0;
}
.star {
  width: 3px;
  height: 3px;
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
