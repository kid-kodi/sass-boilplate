import { User } from "@/lib/schemas";
import { verifySession } from "@/lib/session";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createUser(
  role: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const session = await verifySession();

  if (!session) return null;

  return fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session}`,
    },
    body: JSON.stringify({
      role,
      firstName,
      lastName,
      email,
      password,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
}

export const getUsers = cache(
  async (
    searchParams:
      | { query?: string | undefined; page?: string | undefined }
      | undefined
  ) => {
    const session = await verifySession();

    if (!session) return null;

    const params = new URLSearchParams(searchParams);

    return fetch(`${API_URL}/api/users/search?${params}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.session}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  }
);

export const getUser = async (userId: string) => {
  const session = await verifySession();

  if (!session) return null;

  return fetch(`${API_URL}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateUser = async (userId: string, user: User) => {
  const session = await verifySession();

  if (!session) return null;

  return fetch(`${API_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeUser = async (userId: string) => {
  const session = await verifySession();

  if (!session) return null;

  return fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
