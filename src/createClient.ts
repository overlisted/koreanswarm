import { raw, wrap } from "@dogehouse/kebab";

const createClient = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  const connection = await raw.connect(token, refreshToken, {
    onConnectionTaken: console.error,
  });
  return wrap(connection);
};

export default createClient;
