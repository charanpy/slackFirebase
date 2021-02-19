import React from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"]
  };

  addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  isAuthorized = (file) => this.state.authorized.includes(mime.lookup(file));

  sendFile = () => {
    const { file } = this.state;

    if (file) {
      if (this.isAuthorized(file.name)) {
        const metaData = {
          contentType: mime.lookup(file.name)
        };
        this.props.uploadFile(file, metaData);
        this.props.closeModal();
        this.clearFile();
      }
    }
  };

  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File types: jpg,png"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" />
            Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
