type handler = () => void;

const getButtonElement = (text: string, handler: handler) => {
  const $button = document.createElement('button');
  $button.innerText = text;
  $button.addEventListener('click', handler);
  return $button;
};

export const getInfoWindowElement = (
  startHandler: handler,
  endHandler: handler
) => {
  const $div = document.createElement('div');
  $div.appendChild(getButtonElement('출발', startHandler));
  $div.appendChild(getButtonElement('도착', endHandler));
  return $div;
};
