<template>
  <transition name="toast-fade">
    <div :class="toastClass" :style="toastStyle" @mouseenter="clearTimer" @mouseleave="startTimer" v-if="show">
      <span :class="toastIcon">{{ typeMarkup }}</span>
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    zIndex: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    typeMarkup() {
      switch (this.type) {
        case 'success': return '\u2713';
        case 'warn': return '!';
        case 'error': return '\u00d7';
        default: return 'i';
      }
    },
    toastClass() {
      return [
        'toast',
        `toast--${this.type}`,
      ];
    },
    toastStyle() {
      return {
        'z-index': this.zIndex,
      };
    },
    toastIcon() {
      return ['toast__icon', `toast__icon--${this.type}`];
    },
  },
  data() {
    return {
      duration: 3000,
      timer: null,
      closed: false,
      show: false,
    };
  },
  methods: {
    open() {
      this.show = true;
      this.startTimer();
    },
    startTimer() {
      this.$el.removeEventListener('transitionend', this.startTimer);
      this.$el.removeEventListener('webkittransitionend', this.startTimer);

      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.closed = true;
        }
      }, this.duration);
    },
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    destroyToast() {
      this.$el.removeEventListener('transitionend', this.destroyToast);
      this.$destroy();
      if (this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
    },
  },
  watch: {
    closed(closeIt) {
      if (closeIt) {
        this.show = false;
        this.$el.addEventListener('transitionend', this.destroyToast);
      }
    },
  },
};
</script>

<style lang="scss">
.toast {
  display: flex;
  box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
  color: #8391a5;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 20em;
  background-color: #FBFBFB;
  line-height: 3em;

  p {
    margin: 0 1em;
  }

  &__icon {
    color: #fff;
    text-align: center;
    width: 1.5em;
    font-size: 2em;
  }

  &--info {
    .toast__icon {
      background-color: #50bfff;
    }
  }
  &--warn {
    .toast__icon {
      background-color: #f7ba2a;
    }
  }
  &--error {
    .toast__icon {
      background-color: #ff4949;
    }
  }
  &--success {
    .toast__icon {
      background-color: #13ce66;
    }
  }
}

.toast-fade {
  &-enter, &-leave-active {
    opacity: 0;
    transform: translate(-50%, -100%);
  }

  &-enter-active, &-leave-active {
    transition: opacity .2s, transform .2s;
  }
}
</style>
