export const clearAuthentication = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refreshToken');
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('token');
  }
};

export const authenticate = async (fetcher, username, password) => {
  let success = false;
  let error;

  return fetcher({
    query: `
        mutation authenticateByUsername($username: String!, $password: String!) {
          authenticateByUsername(
            input: {
              data: {
                username: $username,
                password: $password
              }
            }
          ) {
            clientMutationId
            result {
              tokens {
                refreshToken
                token
              }
            }
          }
        }
      `,
    variables: {
      username,
      password,
    },
    authMode: false,
  }).then((result) => {
    if (result.errors?.[0]?.code === 'AuthenticationError') {
      error = 'AuthenticationError';
    } else {
      const token = result.data?.authenticateByUsername?.result?.tokens?.token;
      const refreshToken =
        result.data?.authenticateByUsername?.result?.tokens?.refreshToken;

      if (token && refreshToken) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('token', token);
          window.localStorage.setItem('refreshToken', refreshToken);
          success = true;
        }
      }
    }

    return [success, error];
  });
};
