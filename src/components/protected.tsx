// pages/protected.tsx
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const ProtectedPage = () => {
  return <h1>Esta é uma página protegida!</h1>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProtectedPage;