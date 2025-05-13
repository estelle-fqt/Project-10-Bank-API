import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserThunk } from "../redux/authSlice";

function EditUsername() {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    setUsername(user?.username);
  }, [user]);

  const save = async (e) => {
    e.preventDefault(); // empêche le rechargement du formulaire
    try {
      const updatedUser = await dispatch(
        updateUserThunk({ token, userName: username })
      ).unwrap(); // unwrap accède directement aux données sans l'obj "action"
      setEditing(false); // revient à l'affichage normal
      setUsername(updatedUser.userName); // Met à jour l'input avec le nouveau pseudo
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const cancel = () => {
    setUsername(user?.username || ""); //remet l'ancien pseudo
    setEditing(false); //ferme le formulaire
  };

  return (
    <>
      {!editing ? (
        <button className="edit-button" onClick={() => setEditing(true)}>
          Edit Name
        </button>
      ) : (
        <form onSubmit={save} className="edit-form">
          <div className="edit-item">
            <label htmlFor="username">User name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="edit-item">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              value={user?.firstName}
              disabled
            />
          </div>
          <div className="edit-item">
            <label htmlFor="lasttName">Last name</label>
            <input type="text" id="lastName" value={user?.lastName} disabled />
          </div>
          <div className="form-buttons">
            <button type="submit" className="edit-button form-btn">
              Save
            </button>
            <button
              type="button"
              className="edit-button form-btn"
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default EditUsername;
