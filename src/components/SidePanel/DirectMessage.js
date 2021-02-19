import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../firebase";

export default class DirectMessage extends React.Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database.ref('.info/connected')
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = (currentUserUid) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef
  };
  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          {users.length}
        </Menu.Item>
      </Menu.Menu>
    );
  }
}
