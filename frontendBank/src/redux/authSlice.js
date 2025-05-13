import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, userProfile, updateUser } from "./authAPI";

// Prépare l'état initial
const token = localStorage.getItem("token");
let parsedUser = null;

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) parsedUser = JSON.parse(storedUser);
} catch (e) {
  console.error("Erreur lors de l'analyse :", e);
  localStorage.removeItem("user"); // nettoie si les données sont mauvaises
}

const initialState = {
  user: parsedUser,
  isAuthenticated: !!token, // Vérifie si le token existe dans le localStorage
  token: token || null, // Récupère le token du localStorage
  error: null,
};

// THUNKS
export const loginThunk = createAsyncThunk(
  "auth/login", // nom de l'action (pending, fulfilled, rejected)
  async (dataUser, thunkAPI) => {
    try {
      const token = await loginUser(dataUser); // appel à l'API

      // Une fois connecté, récupérer le profil
      const response = await thunkAPI.dispatch(userProfileThunk(token));
      const user = response.payload;

      // Si "Remember me" est coché, stocke infos dans localStorage
      if (dataUser.rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return token; // si reponse ok
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // erreur personnalisée
    }
  }
);

export const userProfileThunk = createAsyncThunk(
  "auth/userProfile",
  async (token, thunkAPI) => {
    try {
      const userData = await userProfile(token);
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "auth/updateUser",
  async ({ token, userName }, thunkAPI) => {
    try {
      const updatedUser = await updateUser(token, userName); // Appel API pour mettre à jour l'username

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser; // Retourne les données mises à jour
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Gère les erreurs
    }
  }
);

// SLICE gérant l'authentification
const authSlice = createSlice({
  name: "auth",
  initialState,

  // actions synchrones
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;

      // nettoie localStorage lors de la déconnexion
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  // actions asynchrones : ecoute ce que renvoie les thunk
  extraReducers: (builder) => {
    builder
      // voici comment modifier le state quand requête réussit
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.token = action.payload; // stocker le token dans le state
        state.isAuthenticated = true; // utilisateur connecté
        state.error = null;
      })
      // voici comment modifier le state quand requête échoue
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload; // stocke l'erreur dans le state
        state.token = null; // nettoie le token
        state.isAuthenticated = false;
      })

      .addCase(userProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(userProfileThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        // localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
