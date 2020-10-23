import React, {Component} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Icon, Form } from "semantic-ui-react";
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export default class Contacts extends Component {
    state = { firstName: '', lastName: '', emailAddress: '', activeTabKey: '1'}
    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    constructor(props) {
        super(props);
        this.state = {contacts: [], isLoading: true, activeTabKey: '1'};
        this.getData = this.getData.bind(this);
    }

    // initial load of contacts from api
    getData = () => {
        // if we're refreshing this page, clear out any prior form data
        this.setState({isLoading: true, firstName: '', lastName: '', emailAddress: '', contactId: ''});

        fetch('http://ec2-34-207-162-62.compute-1.amazonaws.com:8080/contact')
            .then(response => response.json())
            .then(data => this.setState({contacts: data, isLoading: false}));
    }

    componentDidMount() {
        this.getData();
    }

    // called to add (or update) a contact
    // only difference between add or update is if contactId is present
    addContact(refToThis) {
        const { firstName, lastName, emailAddress, contactId } = this.state
        this.setState({ firstName: firstName, lastName: lastName, emailAddress:emailAddress, contactId:contactId })
        const contact = {firstName: firstName, lastName: lastName, emailAddress: emailAddress, id: contactId};

        // TODO - both POST and PUT send a contact, and service layer decides if it's an insert or update.  Not REST standards.
        var self = refToThis;
        fetch('http://ec2-34-207-162-62.compute-1.amazonaws.com:8080/contact', {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {

            // user confirmation that contact was added
            toast("Added Contact");

            // after add refresh our contact list and switch back to tab 1
            self.getData();
            self.setState({ activeTabKey: '1' });
            return;
        });
    }

    // populates form with contact info for editing
    editContact(id) {

        this.changeSelectedTab('2');

        // grab latest info on this contact
        // we already have it in the table, so we could pass it in, but a re-fetch
        // guarantees latest content
        fetch('http://ec2-34-207-162-62.compute-1.amazonaws.com:8080/contact/' + id, {
            method: 'GET'
        })
             .then(response => response.json())
             .then(data => this.setState({firstName: data.firstName, lastName: data.lastName, emailAddress: data.emailAddress, contactId: data.id, isLoading: false}))
    }

    // delete a contact from api/mongo system
    // TODO - should delete button be on contact list screen or edit contact form
    deleteContact(id) {

        var self = this;
        fetch('http://ec2-34-207-162-62.compute-1.amazonaws.com:8080/contact/' + id, {
            method: 'DELETE'
        }).then(function(response) {

            // user feedback that contact was deleted
            toast("Removed Contact");
            self.getData();
            return;
        })
    }

    // handler to switch active tab on click
    // needed since we programmatically change tab in some cases
    changeSelectedTab = activeKey => {

        this.setState({isLoading: false, activeTabKey: activeKey.toString()});
    };

    // all components are rendered here
    // tab container
    //      tab1
    //          table of all contacts
    //      tab2
    //          add/edit contact form
    //
    // TODO - split these up into separate component files
    render() {
        const {contacts, isLoading, firstName, lastName, emailAddress, contactId} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        // when displaying contact list
        // create a tableRow for each entry, along with a edit  and delete button
        const contactList = contacts.map(contact => {
            return <tr key={contact.id}>
                <td style={{whiteSpace: 'nowrap'}}><Icon onClick={() => this.deleteContact(contact.id)}  name='user delete' />&nbsp;&nbsp;&nbsp;<Icon onClick={() => this.editContact(contact.id)}  name='edit' /></td>
                <td style={{whiteSpace: 'nowrap'}}>{contact.firstName}</td>
                <td style={{whiteSpace: 'nowrap'}}>{contact.lastName}</td>
                <td style={{whiteSpace: 'nowrap'}}>{contact.emailAddress}</td>
                </tr>
        });

        return (
            <Tabs hideAdd activeKey={this.state.activeTabKey} onChange={this.changeSelectedTab} >
                // START tab 1 - contact list
                <TabPane tab="Contact List" key="1">
                <div>
                <table className="ui celled striped table">
                    <thead className="">
                    <tr className="">
                        <th colSpan="4" className="">Interview Contacts</th>
                    </tr>
                    </thead>
                    <tbody className="">
                    <tr className="">
                        <td className="collapsing"><strong>Actions</strong></td>
                        <td className=""><strong>First Name</strong></td>
                        <td className=""><strong>Last Name</strong></td>
                        <td className=""><strong>Email</strong></td>
                    </tr>
                    {contactList}
                    </tbody>
                </table>
                </div>
                </TabPane>
                // START tab 2 - edit form
                <TabPane tab="Edit Contact" key="2" disabled={true}>
                    <div>
                    <Form.Group>
                    <Form onSubmit={() => this.addContact(this)}>
                    <Form.Input
                        placeholder='Contact Id'
                        name='contactId'
                        value={contactId}
                        onChange={this.handleChange}
                        disabled={true}
                    />
                    <Form.Input
                        placeholder='First Name'
                        name='firstName'
                        value={firstName}
                        onChange={this.handleChange}

                    />
                    <Form.Input
                        placeholder='Last Name'
                        name='lastName'
                        value={lastName}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        placeholder='Email Address'
                        name='emailAddress'
                        value={emailAddress}
                        onChange={this.handleChange}
                    />
                    <Form.Button content="Submit" />
                </Form>
                </Form.Group>
                </div>
                </TabPane>
                <TabPane tab="Add Contact" key="3">
                    <div>
                        <Form.Group>
                            <Form onSubmit={() => this.addContact(this)}>
                                <Form.Input
                                    placeholder='Contact Id'
                                    name='contactId'
                                    value=''
                                    onChange={this.handleChange}
                                    disabled={true}
                                />
                                <Form.Input
                                    placeholder='First Name'
                                    name='firstName'
                                    value={firstName}
                                    onChange={this.handleChange}

                                />
                                <Form.Input
                                    placeholder='Last Name'
                                    name='lastName'
                                    value={lastName}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    placeholder='Email Address'
                                    name='emailAddress'
                                    value={emailAddress}
                                    onChange={this.handleChange}
                                />
                                <Form.Button content="Submit" />
                            </Form>
                        </Form.Group>
                    </div>
                </TabPane>
            </Tabs>
        );
    }
}