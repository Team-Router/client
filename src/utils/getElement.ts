type handler = () => void;

// infoWindowElement
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

// result Overlay
const getSpanContainer = (message: string, value: number, digit: string) => {
  const $div = document.createElement('div');
  $div.setAttribute(
    'style',
    'display: flex; justify-content: space-between; gap: 8px;'
  );
  const $messageSpan = document.createElement('span');
  $messageSpan.innerText = `${message}`;
  const $valueSpan = document.createElement('span');
  $valueSpan.innerText = `${value}${digit}`;
  $div.appendChild($messageSpan);
  $div.appendChild($valueSpan);
  return $div;
};

export const getResultOverlayElement = (distance: number, duration: number) => {
  const $div = document.createElement('div');
  $div.setAttribute(
    'style',
    'padding: 10px; background-color: white; border-radius: 15px; display: flex; flex-direction: column; gap: 5px; border: 1px solid #ACACAC;'
  );

  const $distanceSpanContainer = getSpanContainer('총거리', distance, 'm');
  const $durationSpanContainer = getSpanContainer(
    '소요시간',
    Math.floor(duration / 60),
    '분'
  );
  $div.appendChild($distanceSpanContainer);
  $div.appendChild($durationSpanContainer);
  return $div;
};
