import React, { Component } from 'react';
import { Button, Modal, Form, Input} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const DescriptionForm = Form.create()(
  class extends Component {

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add an Optional Description"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Description">
              {getFieldDecorator('description', {})(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default class addDescription extends Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.handleSubmit(values)
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    const origDescription = this.props.origDescription;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>{this.props.text}</Button>
        <DescriptionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

