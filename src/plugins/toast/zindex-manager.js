export class PopupManager {
  constructor(minZIndex) {
    this.minIndex = minZIndex;
    this.zIndex = minZIndex;
  }

  nextZIndex() {
    this.zIndex = Math.max(this.zIndex + 1, this.minIndex);
    return this.zIndex;
  }
}

const defaultPopupManager = new PopupManager(0);

export function nextZIndex() {
  return defaultPopupManager.nextZIndex();
}

export default {
  PopupManager,
  nextZIndex,
};