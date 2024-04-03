<template>
  <div class="timer-wrap">
    <div class="timer">
      <div class="countdown fc">
        <div class="callout">
          <div class="price">
            <div>{{ days }}</div>
          </div>
          <small class="mt-2">Days</small>
        </div>
        <h2>Bookings ongoing</h2>
        <router-link class="view white--text">
          <span>Book now >></span></router-link
        >
        <div class="numbers fr">
          <div class="hours tens">
            <div class="numlist">
              <div class="num">{{ hour }}:</div>
            </div>
          </div>
          <div class="mins ones">
            <div class="numlist">
              <div class="num">{{ min }}:</div>
            </div>
          </div>
          <div class="secs ones">
            <div class="numlist">
              <div class="num">{{ sec }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventCountdown",
  props: {
    startDate: {
      type: Date,
      default() {
        return new Date();
      },
    },
    negative: {
      type: Boolean,
      default: false,
    },
    eventName: {
      type: String,
      default: "Event",
    },
  },
  data() {
    return {
      now: new Date(),
      timer: null,
    };
  },
  computed: {
    days() {
      let Difference_In_Time = this.startDate.getTime() - this.now.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return Math.trunc(Difference_In_Days) > 9
        ? Math.trunc(Difference_In_Days)
        : "0" + Math.trunc(Difference_In_Days);
    },
    hour() {
      let h = Math.trunc(((this.startDate - this.now) / 1000 / 3600) % 24);
      return h > 9 ? h : "0" + h;
    },
    min() {
      let m = Math.trunc((this.startDate - this.now) / 1000 / 60) % 60;
      return m > 9 ? m : "0" + m;
    },
    sec() {
      let s = Math.trunc((this.startDate - this.now) / 1000) % 60;
      return s > 9 ? s : "0" + s;
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },
  watch: {
    startDate: {
      immediate: true,
      handler(newVal) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.now = new Date();
          if (this.negative) return;
          if (this.now > newVal) {
            this.now = newVal;
            this.$emit("endTime");
            clearInterval(this.timer);
          }
        }, 1000);
      },
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
.countdown {
  font-size: 12px;
  font-family: "PT Sans Caption", sans-serif;
}
.animate-charcter {
  text-transform: uppercase;
  background-image: linear-gradient(
    -225deg,
    #231557 0%,
    #44107a 29%,
    #ff1361 67%,
    #fff800 100%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 10s linear infinite;
  display: inline-block;
  font-size: 12px;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

a {
  text-decoration: none;
}
.fr {
  display: flex;
}
.fc {
  display: flex;
  flex-direction: column;
}
.timer-wrap {
  width: 100%;
}
.timer-wrap .timer {
  position: relative;
  background: #fff;
}
.timer-wrap .timer h2 {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: #000;
}
.timer-wrap .timer .view {
  color: inherit;
}
.timer-wrap .timer .view span {
  background: var(--v-primary-base);
}
.timer-wrap .timer .numbers {
  align-items: flex-end;
  font-size: 12px;
}
.timer-wrap .timer .numbers .mins {
  font-size: 4rem;
  line-height: 4rem;
  height: 4rem;
  overflow: hidden;
}
.timer-wrap .timer .numbers .hours {
  font-size: 6rem;
  line-height: 6rem;
  height: 6rem;
  overflow: hidden;
}
.timer-wrap .timer .numbers .secs {
  font-size: 3rem;
  line-height: 2.5rem;
  height: 3rem;
  overflow: hidden;
}
.timer-wrap .timer .numbers .hours.ones .numlist {
  /*animation: secones-jaggy 10s ease-in infinite;*/
  animation-delay: -10s;
}
.timer-wrap .timer .numbers .secs.ones .numlist {
  /*animation: secones-jaggy 10s ease-in infinite;*/
  animation-delay: -10s;
}
.timer-wrap .timer .numbers .secs.tens .numlist {
  animation: sectens-jaggy 60s cubic-bezier(0.99, 0.025, 0.97, -0.12) infinite;
  animation-delay: -49s;
}
.timer-wrap .timer .numbers .hours,
.timer-wrap .timer .numbers .mins,
.timer-wrap .timer .numbers .secs {
  background: #fff;
  box-shadow: inset 0 0 3px #f4f5fa;
  margin-right: 0.5rem;
}
.timer-wrap .timer .numbers .seperator {
  font-size: 3rem;
  line-height: 6rem;
  margin-right: 0.5rem;
}
.timer-wrap .timer .callout {
  position: absolute;
  color: #f7f7f7;
  right: -0.5rem;
  background: var(--v-primary-base);
  text-align: center;
  border-radius: 15px;
  padding: 0.5rem 0.5rem;
  width: 12rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.3rem;
  animation: moveCallout 1s 1879s forwards;
  z-index: 1;
}
.timer-wrap .timer .callout .price {
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-content: flex-start;
}
.timer-wrap .timer .callout .price span {
  font-size: 0.6em;
  line-height: 1.4;
}
.timer-wrap .timer .callout .sub {
  font-size: 0.8em;
}
.timer-wrap .timer .callout .sub span {
  font-size: 0.6rem;
  line-height: 1.4;
}
.timer-wrap .timer .callout .now,
.timer-wrap .timer .callout .price,
.timer-wrap .timer .callout .sub {
  animation: shrinkFade 1s 1879s forwards;
}
.timer-wrap .timer .callout .timeout {
  opacity: 0;
  height: 0;
  animation: growFade 0.5s 1879s forwards;
}
@media only screen and (max-width: 480px) {
  .timer-wrap {
    background-size: cover;
    border: 1.4rem solid #fff;
    padding: 0rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .timer-wrap .timer .callout {
    position: absolute;
    top: -1.6rem;
    color: #f7f7f7;
    right: -1.6rem;
    background: var(--v-primary-base);
    text-align: center;
    border-radius: 50%;
    height: 8rem;
    width: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
    font-size: 12px;
    animation: moveCallout 1s 1879s forwards;
  }
  .timer-wrap .timer h2 {
    margin: 0;
    font-weight: 300;
    font-size: 12px;
    color: black;
  }
  .timer-wrap .timer .numbers .hours {
    font-size: 55px;
    line-height: 5.5rem;
    height: 5rem;
    overflow: hidden;
  }
  .timer-wrap .timer .numbers .mins {
    font-size: 45px;
    line-height: 4rem;
    height: 4rem;
    overflow: hidden;
  }
  .timer-wrap .timer .numbers .secs {
    font-size: 35px;
    line-height: 2.5rem;
    height: 3rem;
    overflow: hidden;
  }
}
@-moz-keyframes secones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  8% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-6rem);
  }
  18% {
    transform: translateY(-6rem);
  }
  20% {
    transform: translateY(-12rem);
  }
  28% {
    transform: translateY(-12rem);
  }
  30% {
    transform: translateY(-18rem);
  }
  38% {
    transform: translateY(-18rem);
  }
  40% {
    transform: translateY(-24rem);
  }
  48% {
    transform: translateY(-24rem);
  }
  50% {
    transform: translateY(-30rem);
  }
  58% {
    transform: translateY(-30rem);
  }
  60% {
    transform: translateY(-36rem);
  }
  68% {
    transform: translateY(-36rem);
  }
  70% {
    transform: translateY(-42rem);
  }
  78% {
    transform: translateY(-42rem);
  }
  80% {
    transform: translateY(-48rem);
  }
  88% {
    transform: translateY(-48rem);
  }
  90% {
    transform: translateY(-54rem);
  }
  98% {
    transform: translateY(-54rem);
  }
  100% {
    transform: translateY(-60rem);
  }
  108% {
    transform: translateY(-60rem);
  }
}
@-webkit-keyframes secones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  8% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-6rem);
  }
  18% {
    transform: translateY(-6rem);
  }
  20% {
    transform: translateY(-12rem);
  }
  28% {
    transform: translateY(-12rem);
  }
  30% {
    transform: translateY(-18rem);
  }
  38% {
    transform: translateY(-18rem);
  }
  40% {
    transform: translateY(-24rem);
  }
  48% {
    transform: translateY(-24rem);
  }
  50% {
    transform: translateY(-30rem);
  }
  58% {
    transform: translateY(-30rem);
  }
  60% {
    transform: translateY(-36rem);
  }
  68% {
    transform: translateY(-36rem);
  }
  70% {
    transform: translateY(-42rem);
  }
  78% {
    transform: translateY(-42rem);
  }
  80% {
    transform: translateY(-48rem);
  }
  88% {
    transform: translateY(-48rem);
  }
  90% {
    transform: translateY(-54rem);
  }
  98% {
    transform: translateY(-54rem);
  }
  100% {
    transform: translateY(-60rem);
  }
  108% {
    transform: translateY(-60rem);
  }
}
@-o-keyframes secones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  8% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-6rem);
  }
  18% {
    transform: translateY(-6rem);
  }
  20% {
    transform: translateY(-12rem);
  }
  28% {
    transform: translateY(-12rem);
  }
  30% {
    transform: translateY(-18rem);
  }
  38% {
    transform: translateY(-18rem);
  }
  40% {
    transform: translateY(-24rem);
  }
  48% {
    transform: translateY(-24rem);
  }
  50% {
    transform: translateY(-30rem);
  }
  58% {
    transform: translateY(-30rem);
  }
  60% {
    transform: translateY(-36rem);
  }
  68% {
    transform: translateY(-36rem);
  }
  70% {
    transform: translateY(-42rem);
  }
  78% {
    transform: translateY(-42rem);
  }
  80% {
    transform: translateY(-48rem);
  }
  88% {
    transform: translateY(-48rem);
  }
  90% {
    transform: translateY(-54rem);
  }
  98% {
    transform: translateY(-54rem);
  }
  100% {
    transform: translateY(-60rem);
  }
  108% {
    transform: translateY(-60rem);
  }
}
@keyframes secones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  8% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-6rem);
  }
  18% {
    transform: translateY(-6rem);
  }
  20% {
    transform: translateY(-12rem);
  }
  28% {
    transform: translateY(-12rem);
  }
  30% {
    transform: translateY(-18rem);
  }
  38% {
    transform: translateY(-18rem);
  }
  40% {
    transform: translateY(-24rem);
  }
  48% {
    transform: translateY(-24rem);
  }
  50% {
    transform: translateY(-30rem);
  }
  58% {
    transform: translateY(-30rem);
  }
  60% {
    transform: translateY(-36rem);
  }
  68% {
    transform: translateY(-36rem);
  }
  70% {
    transform: translateY(-42rem);
  }
  78% {
    transform: translateY(-42rem);
  }
  80% {
    transform: translateY(-48rem);
  }
  88% {
    transform: translateY(-48rem);
  }
  90% {
    transform: translateY(-54rem);
  }
  98% {
    transform: translateY(-54rem);
  }
  100% {
    transform: translateY(-60rem);
  }
  108% {
    transform: translateY(-60rem);
  }
}
@-moz-keyframes sectens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.99% {
    transform: translateY(0rem);
  }
  16.666666666666668% {
    transform: translateY(-6rem);
  }
  26.656666666666666% {
    transform: translateY(-6rem);
  }
  33.333333333333336% {
    transform: translateY(-12rem);
  }
  43.32333333333334% {
    transform: translateY(-12rem);
  }
  50% {
    transform: translateY(-18rem);
  }
  59.99% {
    transform: translateY(-18rem);
  }
  66.66666666666667% {
    transform: translateY(-24rem);
  }
  76.65666666666667% {
    transform: translateY(-24rem);
  }
  83.33333333333334% {
    transform: translateY(-30rem);
  }
  93.32333333333334% {
    transform: translateY(-30rem);
  }
  100% {
    transform: translateY(-36rem);
  }
  109.99% {
    transform: translateY(-36rem);
  }
}
@-webkit-keyframes sectens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.99% {
    transform: translateY(0rem);
  }
  16.666666666666668% {
    transform: translateY(-6rem);
  }
  26.656666666666666% {
    transform: translateY(-6rem);
  }
  33.333333333333336% {
    transform: translateY(-12rem);
  }
  43.32333333333334% {
    transform: translateY(-12rem);
  }
  50% {
    transform: translateY(-18rem);
  }
  59.99% {
    transform: translateY(-18rem);
  }
  66.66666666666667% {
    transform: translateY(-24rem);
  }
  76.65666666666667% {
    transform: translateY(-24rem);
  }
  83.33333333333334% {
    transform: translateY(-30rem);
  }
  93.32333333333334% {
    transform: translateY(-30rem);
  }
  100% {
    transform: translateY(-36rem);
  }
  109.99% {
    transform: translateY(-36rem);
  }
}
@-o-keyframes sectens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.99% {
    transform: translateY(0rem);
  }
  16.666666666666668% {
    transform: translateY(-6rem);
  }
  26.656666666666666% {
    transform: translateY(-6rem);
  }
  33.333333333333336% {
    transform: translateY(-12rem);
  }
  43.32333333333334% {
    transform: translateY(-12rem);
  }
  50% {
    transform: translateY(-18rem);
  }
  59.99% {
    transform: translateY(-18rem);
  }
  66.66666666666667% {
    transform: translateY(-24rem);
  }
  76.65666666666667% {
    transform: translateY(-24rem);
  }
  83.33333333333334% {
    transform: translateY(-30rem);
  }
  93.32333333333334% {
    transform: translateY(-30rem);
  }
  100% {
    transform: translateY(-36rem);
  }
  109.99% {
    transform: translateY(-36rem);
  }
}
@keyframes sectens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.99% {
    transform: translateY(0rem);
  }
  16.666666666666668% {
    transform: translateY(-6rem);
  }
  26.656666666666666% {
    transform: translateY(-6rem);
  }
  33.333333333333336% {
    transform: translateY(-12rem);
  }
  43.32333333333334% {
    transform: translateY(-12rem);
  }
  50% {
    transform: translateY(-18rem);
  }
  59.99% {
    transform: translateY(-18rem);
  }
  66.66666666666667% {
    transform: translateY(-24rem);
  }
  76.65666666666667% {
    transform: translateY(-24rem);
  }
  83.33333333333334% {
    transform: translateY(-30rem);
  }
  93.32333333333334% {
    transform: translateY(-30rem);
  }
  100% {
    transform: translateY(-36rem);
  }
  109.99% {
    transform: translateY(-36rem);
  }
}
@-moz-keyframes minones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109% {
    transform: translateY(-80rem);
  }
}
@-webkit-keyframes minones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109% {
    transform: translateY(-80rem);
  }
}
@-o-keyframes minones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109% {
    transform: translateY(-80rem);
  }
}
@keyframes minones-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109% {
    transform: translateY(-80rem);
  }
}
@-moz-keyframes mintens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.5% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19.5% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29.5% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39.5% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49.5% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59.5% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69.5% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79.5% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89.5% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99.5% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109.5% {
    transform: translateY(-80rem);
  }
}
@-webkit-keyframes mintens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.5% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19.5% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29.5% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39.5% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49.5% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59.5% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69.5% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79.5% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89.5% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99.5% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109.5% {
    transform: translateY(-80rem);
  }
}
@-o-keyframes mintens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.5% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19.5% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29.5% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39.5% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49.5% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59.5% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69.5% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79.5% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89.5% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99.5% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109.5% {
    transform: translateY(-80rem);
  }
}
@keyframes mintens-jaggy {
  0% {
    transform: translateY(0rem);
  }
  9.5% {
    transform: translateY(0rem);
  }
  10% {
    transform: translateY(-8rem);
  }
  19.5% {
    transform: translateY(-8rem);
  }
  20% {
    transform: translateY(-16rem);
  }
  29.5% {
    transform: translateY(-16rem);
  }
  30% {
    transform: translateY(-24rem);
  }
  39.5% {
    transform: translateY(-24rem);
  }
  40% {
    transform: translateY(-32rem);
  }
  49.5% {
    transform: translateY(-32rem);
  }
  50% {
    transform: translateY(-40rem);
  }
  59.5% {
    transform: translateY(-40rem);
  }
  60% {
    transform: translateY(-48rem);
  }
  69.5% {
    transform: translateY(-48rem);
  }
  70% {
    transform: translateY(-56rem);
  }
  79.5% {
    transform: translateY(-56rem);
  }
  80% {
    transform: translateY(-64rem);
  }
  89.5% {
    transform: translateY(-64rem);
  }
  90% {
    transform: translateY(-72rem);
  }
  99.5% {
    transform: translateY(-72rem);
  }
  100% {
    transform: translateY(-80rem);
  }
  109.5% {
    transform: translateY(-80rem);
  }
}
@-moz-keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes shrinkFade {
  100% {
    height: 0;
    margin: 0;
    opacity: 0;
  }
}
@-webkit-keyframes shrinkFade {
  100% {
    height: 0;
    margin: 0;
    opacity: 0;
  }
}
@-o-keyframes shrinkFade {
  100% {
    height: 0;
    margin: 0;
    opacity: 0;
  }
}
@keyframes shrinkFade {
  100% {
    height: 0;
    margin: 0;
    opacity: 0;
  }
}
@-moz-keyframes growFade {
  100% {
    height: auto;
    opacity: 1;
  }
}
@-webkit-keyframes growFade {
  100% {
    height: auto;
    opacity: 1;
  }
}
@-o-keyframes growFade {
  100% {
    height: auto;
    opacity: 1;
  }
}
@keyframes growFade {
  100% {
    height: auto;
    opacity: 1;
  }
}
@-moz-keyframes moveCallout {
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
@-webkit-keyframes moveCallout {
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
@-o-keyframes moveCallout {
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
@keyframes moveCallout {
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
