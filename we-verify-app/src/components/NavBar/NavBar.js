import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Tutorial from "../Tutorial/Tutorial";

function NavBar() {
    const [tab, setTab] = useState('1');
    const changeTab = (new_tab) => {
        if (new_tab !== tab)
            setTab(new_tab);
    };

    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({active: tab === '1'})}
                        onClick={() => changeTab('1')}
                    >
                        Tools
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: tab === '2'})}
                        onClick={() => changeTab('2')}
                    >
                        Tutorial
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: tab === '3'})}
                        onClick={() => changeTab('3')}
                    >
                        ClassRoom
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: tab === '4'})}
                        onClick={() => changeTab('4')}
                    >
                        Interactive
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: tab === '5'})}
                        onClick={() => changeTab('5')}
                    >
                        About
                    </NavLink>
                </NavItem>
            </Nav>
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