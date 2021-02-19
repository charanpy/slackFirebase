import React, { Component } from "react";
import { Icon, Menu, Modal, Form, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions/index";
import firebase from "../../firebase";

class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetail: "",
    channelRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: ""
  };

  componentDidMount() {
    this.addListener();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelRef.off();
  };
  addListener = () => {
    let loadedChannel = [];
    this.state.channelRef.on("child_added", (snap) => {
      loadedChannel.push(snap.val());
      console.log(loadedChannel);
      this.setState(
        {
          channels: loadedChannel
        },
        () => this.setFirstChannel()
      );
    });
  };

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(this.state.channels[0]);
      this.setActiveChannel(this.state.channels[0]);
    }
    this.setState({
      firstLoad: false
    });
  };

  openModal = () => {
    this.setState({
      modal: true
    });
  };

  closeModal = () => {
    this.setState({
      modal: false
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail;

  addChannel = () => {
    const { channelRef, channelName, channelDetail } = this.state;

    const key = channelRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL
      }
    };

    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelName: "",
          channlDetail: ""
        });
        this.closeModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  setActiveChannel = (channel) => {
    this.setState({
      activeChannel: channel.id
    });
  };
  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));
  render() {
    const { channels, modal } = this.state;
    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About Channel"
                  name="channelDetail"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);
