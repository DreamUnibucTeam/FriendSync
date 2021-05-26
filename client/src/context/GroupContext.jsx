import React, { useState, createContext } from "react";

const GroupContext = createContext([{}, () => {}]);

const GroupProvider = (props) => {
  const [state, setState] = useState({
    userUid: null,
    id: null,
    name: "",
    groupPhotoUrl: "default",
    owner: null,
    meeting: null,
  });

  return (
    <GroupContext.Provider value={[state, setState]}>
      {props.children}
    </GroupContext.Provider>
  );
};

export { GroupContext, GroupProvider };
