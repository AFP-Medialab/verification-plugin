import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, Navbar, NavLink, Row, Col} from 'reactstrap';
import classnames from 'classnames';


import "../css/NavBar.css";
import logo_invid from "./images/logo-invid.png";
import tools_on from "./images/tools.png";
import tools_off from "./images/tools-off.png";
import tutorial_on from "./images/tutorial.png";
import tutorial_off from "./images/tutorial-off.png";
import classroom_on from "./images/classroom.png";
import classroom_off from "./images/classroom-off.png";
import interactive_on from "./images/interactive.png";
import interactive_off from "./images/interactive-off.png";
import about_on from "./images/about.png";
import about_off from "./images/about-off.png";
import logo_weverify from "./images/logo-we-verify.png";

import Tutorial from "../Tutorial/Tutorial";
import Languages from "../Languages/Languages"

const NavBar = () => {
    const [tab, setTab] = useState('2');
    const changeTab = (new_tab) => {
        if (new_tab !== tab)
            setTab(new_tab);
    };

    const icons_className = "nav_icons";
    const lang = 'fr';

    return (
        <div>
            <div color='light' className={"container-fluid my_nav sticky-top"}>
                <div className={"row justify-content-center"}>
                    <div className={"col-md-2 col-sm-2 col-xs-2 text-left d-none d-lg-block"}>
                        <img src={logo_invid} className={"logo_left mt-2"} alt={""}/>
                    </div>
                    <div className={"col"}>
                        <ul className='list-group list-group-horizontal justify-content-center'>
                            <li className={"list-group-item border-0"}>
                                <div onClick={() => changeTab('1')}>
                                    <img className={icons_className} src={(tab === '1') ? tools_on : tools_off}
                                         alt={Languages(lang, 'navbar_tools')}/>
                                </div>
                            </li>
                            <li className={"list-group-item border-0"}>
                                <div className={classnames({active: tab === '2'})} onClick={() => changeTab('2')}>
                                    <img className={icons_className} src={(tab === '2') ? tutorial_on : tutorial_off}
                                         alt={Languages(lang, 'navbar_tuto')}/>
                                </div>
                            </li>
                            <li className={"list-group-item border-0"}>
                                <div className={classnames({active: tab === '3'})} onClick={() => changeTab('3')}>
                                    <img className={icons_className} src={(tab === '3') ? classroom_on : classroom_off}
                                         alt={Languages(lang, 'navbar_classroom')}/>
                                </div>
                            </li>
                            <li className={"list-group-item border-0"}>
                                <div className={classnames({active: tab === '4'})} onClick={() => changeTab('4')}>
                                    <img className={icons_className}
                                         src={(tab === '4') ? interactive_on : interactive_off}
                                         alt={Languages(lang, 'navbar_quiz')}/>
                                </div>
                            </li>
                            <li className={"list-group-item border-0"}>
                                <div className={classnames({active: tab === '5'})} onClick={() => changeTab('5')}>
                                    <img className={icons_className} src={(tab === '5') ? about_on : about_off}
                                         alt={Languages(lang, 'navbar_quiz mt-2')}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={"col-md-2 col-sm-2 col-xs-2 text-right d-none d-lg-block"}>
                        <img src={logo_weverify} className={"logo_right"} alt={""}/>
                    </div>
                </div>
            </div>

            <TabContent activeTab={tab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 1 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Tutorial/>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 3 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="4">
                    <Row>
                        <Col sm="12">

                            <h4>Tab 4 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="5">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 5 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    );
}
export default NavBar;