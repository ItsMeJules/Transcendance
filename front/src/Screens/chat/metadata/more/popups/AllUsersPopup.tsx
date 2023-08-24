import React, { useState } from "react";
import Popup from "../../../utils/Popup";
import UsersList from "../../../utils/UsersList";

export default function AllUsers() {
  const [searchText, setSearchText] = useState("");

  return (
    <Popup className="all-users-popup">
      <input
        className="filter-users"
        type="search"
        placeholder="Chercher un utilisateur"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <UsersList filter={(userName) => userName.includes(searchText)} />
    </Popup>
  );
}
