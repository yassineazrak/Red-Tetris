import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import NotifComponent from "./Notifications";

import { NavbarStyled, NotifDiv, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { Affix, Dropdown, Menu } from "antd";

import { connect } from "react-redux";
import { isAuth, logout } from "../actions/auth";
import { refreshRoom, leaveRoom } from "../actions/room";
import store from "../sotre";

store.dispatch(isAuth());
store.dispatch(refreshRoom());




const NavbarComponent = (props) => {

    const isLogin = props.isAuth;
    const roomName = props.room.name;

    const LogOut = () => {
        console.log("logout");
        props.leaveRoom();
        props.logout();
    }


    const menu = (
        <Menu>
            <Menu.Item key={"logout"} onClick={LogOut} >
                <span>logout</span>
            </Menu.Item>
        </Menu>
    );

    const userName = (
        <Dropdown overlay={menu} >
            <div style={{
                cursor: "pointer",
            }}>
                {props.user.name}
            </div>
        </Dropdown>
    )


    return (
        <Affix>
            <NavbarStyled className='d-flex justify-content-between'>
                {!isLogin ?
                    <div className='d-flex justify-content-around' style={{width: '100%'}} >
                        <img src={logD} alt="logo" />
                    </div>
                    :
                <>    
                    
                    <h3> {roomName} </h3>
                    <LogoDesktop>
                        <img src={logD} alt="logo" className='d-none d-md-block' />
                    </LogoDesktop>
                    <LogoMobile>
                        <img src={logM} alt="logo" className='d-none d-sm-block'  />
                    </LogoMobile>
                    <NotifDiv>
                        <h3  className="d-none d-sm-block" > {userName} </h3>
                        <NotifComponent />
                    </NotifDiv>
                    </>
                }
            </NavbarStyled>
        </Affix>
    );
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        user: state.auth.user,
        room: state.room.room,
    }
}

const Nabar = connect(mapStateToProps, {leaveRoom, logout})(NavbarComponent);



export default Nabar;