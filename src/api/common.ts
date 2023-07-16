const token = localStorage.getItem('token');

interface Param {
  [key: string]: any;
}

const commonFetch = (url: string, options?: RequestInit) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, { ...options })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: The status is ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const getFetch = (url: string, options?: RequestInit) => {
  return commonFetch(url, {
    ...options,
    mode: 'cors',
    headers: {
      Authentication: `Bearer ${token}`,
    },
  });
};

export const postFetch = (url: string, param: Param, options?: RequestInit) => {
  return commonFetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authentication: `Bearer ${token}`,
    },
    mode: 'cors',
    body: JSON.stringify(param),
  });
};
