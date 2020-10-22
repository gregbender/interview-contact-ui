import React, {Component} from "react";
export default class Contacts extends Component {

    constructor(props) {
        super(props);
        this.state = {contacts: [], isLoading: true};
        this.getData = this.getData.bind(this);
    }

    getData = () => {
        this.setState({isLoading: true});

        fetch('/contact')
            .then(response => response.json())
            .then(data => this.setState({contacts: data, isLoading: false}));
    }

    componentDidMount() {
        this.getData();
    }
    //masterusermongogregbender7
    //asdfasdfasdfasdfas3242345f1sd5
    addContact(refToThis) {
        const contact = {firstName: "Greg", lastName: "Bender", emailAddress: null, id: null};
        var self = refToThis;
        fetch('/contact', {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            self.getData();
            return;
        }).then(function(data) {
            console.log("test");
        });
    }

    deleteContact(id) {
        var self = this;
        fetch('/contact/' + id, {
            method: 'DELETE'
        }).then(function(response) {
            self.getData();
            return;
        }).then(function(data) {
            console.log("test");
        });
    }


    render() {
        const {contacts, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const contactList = contacts.map(contact => {
            return <tr key={contact.id}>
                    <td><button onClick={() => this.deleteContact(contact.id)}>DELETE</button></td><td style={{whiteSpace: 'nowrap'}}>{contact.firstName}</td>
                </tr>
        });

        return (
            <div>
                <button onClick={() => this.addContact(this)}>ADD</button>
                <table>{contactList}</table>
            </div>
        );
    }
}
