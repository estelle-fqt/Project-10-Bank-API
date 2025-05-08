export async function loginUser(dataUser) {
  // appel de l'API avc fetch
  const response = await fetch("http://localhost:3001/api/v1/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataUser),
  });

  // transforme réponse en JSON
  const data = await response.json();

  // gestion erreurs
  if (!response.ok) {
    // message erreur de l'API
    const errorMessage = data?.message || "Erreur lors de la connexion";

    // message erreur selon le code HTTP
    if (response.status === 400) {
      throw new Error(errorMessage || "Identifiants invalides");
    }
    if (response.status === 404) {
      throw new Error(errorMessage || "Utilisateur non trouvé");
    }
    // autres codes HTTP
    throw new Error(errorMessage);
  }

  // retourne le token d'authentification
  return data.body.token;
}

export async function userProfile(token) {
  const response = await fetch("http://localhost:3001/api/v1/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // transforme réponse en JSON
  const data = await response.json();

  if (!response.ok) {
    // message erreur de l'API
    const errorMessage = data?.message || "Erreur lors de la connexion";
    throw new Error(errorMessage);
  }

  // retourne email, firstName, lastName, createdAt, updateAt, id
  return data.body;
}

export async function updateUser(token, userName) {
  const response = await fetch("http://localhost:3001/api/v1/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userName }),
  });

  const data = await response.json();

  if (!response.ok) {
    // message erreur de l'API
    const errorMessage = data?.message || "Erreur lors de la mise à jour";
    throw new Error(errorMessage);
  }

  // retourne infos mises à jour
  return data.body;
}
