import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { api } from "../lib/api";

const Profile = () => {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.auth.profile().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <Layout>

      <h1 className="text-xl font-bold">Profile</h1>

      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>

    </Layout>
  );
};

export default Profile;