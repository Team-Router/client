interface Param {
  [key: string]: any;
}

const commonFetch = (url: string, options?: RequestInit) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    ...options,
    mode: 'cors',
  })
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
    headers: options?.headers,
  });
};

export const postFetch = (url: string, param: Param, options?: RequestInit) => {
  return commonFetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(param),
  });
};

export const deleteFetch = (url: string, options?: RequestInit) => {
  return commonFetch(url, {
    ...options,
    method: 'DELETE',
    ...options?.headers,
  });
};
