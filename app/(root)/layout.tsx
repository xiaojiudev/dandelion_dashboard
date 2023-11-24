'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Layout, Menu, MenuProps, theme } from 'antd'
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined, ShoppingCartOutlined, FileAddOutlined, OrderedListOutlined } from '@ant-design/icons';


import '../globals.css'

import Provider from '../Provider';
import StyledComponentsRegistry from '@/lib/AntdRegistry'


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href="/">Overview</Link>, '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Product', 'ProductKey', <ShoppingCartOutlined />, [
    getItem(<Link href="/product">Product</Link>, 'ProductSub1', <OrderedListOutlined />),
    getItem('Bill', 'ProductSub2', <FileAddOutlined />),
    getItem('Alex', 'ProductSub3'),
  ]),
  getItem('User', 'User1', <UserOutlined />, [
    getItem('Tom', 'UserSub1'),
    getItem('Bill', 'UserSub2'),
    getItem('Alex', 'UserSub3'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <html lang="en">
      <body>
        <Provider>
          <StyledComponentsRegistry >
            <Layout style={{ minHeight: '100vh' }} hasSider>
              <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
              </Sider>
              <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                  {/* <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb> */}
                  <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                    {children}
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
              </Layout>
            </Layout>
          </StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  )
}
