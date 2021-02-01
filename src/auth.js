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

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('refreshToken');
  }
};

export const authenticate = async (fetcher, username, password) => {
  let success = false;
  let error;

  return (
    fetcher({
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
    })
      // .then((res) => res.data)
      .then((result) => {
        if (result.errors?.[0]?.code === 'AuthenticationError') {
          error = 'AuthenticationError';
        } else {
          const token =
            result.data?.authenticateByUsername?.result?.tokens?.token;
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
      })
      .catch((err) => {
        console.error(err);
        return [success, 'NetworkError'];
      })
  );
};

export const refreshToken = async (fetcher) => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refreshToken found!');
  }

  return (
    fetcher(
      {
        query: `
        mutation refreshToken($refreshToken: String!) {
          refreshToken(input: {
            data:{
              refreshToken: $refreshToken
            }
          }){
            result {
              token
            }
          }
        }
      `,
        variables: {
          refreshToken,
        },
      },
      { isRefreshTokenRequest: true },
    )
      // .then((res) => res.data)
      .then((result) => {
        const token = result.data?.refreshToken?.result?.token;

        if (token) {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('token', token);
          }
        }
      })
  );
};
