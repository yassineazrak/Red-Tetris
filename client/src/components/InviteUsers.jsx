import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { inviteRequest, currentUser } from "../actions";

import { Form, Input, Button, message, Card, Select } from 'antd';

import { gold, red } from '@ant-design/colors';

const { Meta } = Card;
const { Option } = Select;



const InviteUsers = (props) => {

    const [dataSource, setDataSource] = useState([]);
    const [oldValue, setOldValue] = useState('');

    const handleSearch = (value) => {
        if (value && !value.includes(oldValue) || oldValue === '') {
            console.log('searching');
            setOldValue(value);
            props.currentUser(value);
        }
    };

    useEffect(() => {
        const data = props.users.online.map(user => {
            return {
                value: user.name,
                id: user.id
            }
        });
        setDataSource(data);
    }, [props.users]);


    const [input, setInput] = useState({
        value: "",
        id: null,
        error: false,
        errorMessage: "Please enter a valid username at least 3 characters long"
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        input.value.length > 2 ? setInput({
            ...input,
            error: false
        }) : setInput({
            ...input,
            error: true,
        });
        if (input.value.length > 2 && !input.error) {
            const data = {
                roomId: props.room.id,
                userId: input.id,
                userName: input.value,
            }
            props.inviteRequest(data);
        }

    }

    useEffect(() => {
        if (props.invite.error){
            message.error(props.invite.error);
        }
    }, [props.invite.error]);

  

    const handleSelect = (id) => {
        const value = dataSource.filter(item => item.id === id);
        setInput({
            ...input,
            value: value[0].value,
            id: value[0].id,
            error: false
        });
    }

  const options = dataSource.map(item => {
        return (
            <Option key={item.id}
                    value={item.id}
            >{item.value}</Option>
        )
    });

    const filterOption = (inputValue, option) => {
        return (Array.isArray(option.children) ? option.children.join('') :
        option.children).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    }

    const form = (
        <Form >
        <Input.Group style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Form.Item
                name="inviteUsers"
                help={input.error ? props.invite.error : ""}
                validateStatus={input.error ? "error" : input.value.length > 2 ? "success" : ""}
                style={{
                    width: '80%',
                    maxWidth: '40vh',
                }}
            >
                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Search for a user"
                    filterOption={filterOption}
                    onSelect={handleSelect}
                    onSearch={handleSearch}
                >
                    {options}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                    disabled={
                        input.error ||
                        input.value.length < 3
                    }
                    loading={props.room.isLoading || props.invite.isLoading || props.users.isLoading}
                >
                    Invite
                </Button>
            </Form.Item>
        </Input.Group>
    </Form>
    );

    const inviteList = props.invite.invites.map((invite, index) => {
        return (
            <div key={index} style={{
                // marginTop: '5px',
                width: '100%',
                display: 'inline-block',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 2,
                backgroundColor: index % 2 === 0 ? '#fafafa' :  '#f0f0f0',
                }}>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flex: 2,
                        }}>
                            <span>{invite.userId}</span>
                            <span>{invite.userName}</span>
                            <span style={{
                                color: invite.status === 'accepted' ? "#6FCF97" :
                                        invite.status === 'waiting' ?  gold.primary : red[4],
                                padding: '5px',
                                borderRadius: '5px',
                                margin: '5px',
                            }}>{invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}</span>
                    </div>
            </div>
        )
    })

    return (
        <Card title={form} type='inner'
        actions={[
            <Button type="primary" style={{
                display: 'flex',
                margin: 'auto',
                marginTop: '10px',
                }}>
                Leave Room
            </Button>,
            <Button type="primary" style={{
                display: 'flex',
                margin: 'auto',
                marginTop: '10px',
                }}>
                Start Game
            </Button>

        ]}
        style={{
            width: '100%',
            padding: 0,
            margin: 0,
            display: 'inline-block',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            }}>


        
        <div style={{
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            display: 'inline-block',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px #d9d9d9',
            maxHeight: '60vh',
            overflowY: 'scroll',
            }}>
                <Meta type='inner' title={
                    <div style={{
                        width: '100%',
                        display: 'inline-block',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#f0f0f0',
                        paddingTop: '5px',
                        // position: 'fixed',
                        }}>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                alignItems: 'top',
                                flex: 2,
                                }}>
                                    <p>UserId</p>
                                    <p>Name</p>
                                    <p>Status</p>
                            </div> 
                    </div>
                 }  />
                {inviteList}
        </div>
        {/* <Meta type='inner' title={
            <Button type="primary" style={{
                display: 'flex',
                margin: 'auto',
                marginTop: '10px',
                }}>
                Start Game
            </Button>
        } style={{
            backgroundColor: '#fff',
        }} /> */}
        </Card>

    )
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        auth: state.auth,
        invite: state.invite,
        users: state.users,
    }
}

export default connect(mapStateToProps, { inviteRequest, currentUser })(InviteUsers);