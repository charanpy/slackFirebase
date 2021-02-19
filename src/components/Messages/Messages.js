import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import firebase from "../../firebase";

export default class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUser: "",
    searchTerm: "",
    searchLoaded: false,
    searchResults: []
  };
  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListener(channel.id);
    }
  }

  addListener = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({
      searchResults
    });
  };

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoaded: true
      },
      () => this.handleSearchMessages()
    );
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1 ? "users" : "user";
    const numUniqueUser = `${uniqueUsers.length} ${plural}`;
    this.setState({
      numUniqueUser
    });
  };
  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = (channel) => channel && `${channel.name}`;

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUser,
      searchResults,
      searchTerm
    } = this.state;
    console.log(11, channel);
    return (
      <>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUser={numUniqueUser}
          handleSearchChange={this.handleSearchChange}
        />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(
              searchTerm.length > 0 ? searchResults : messages
            )}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </>
    );
  }
}
