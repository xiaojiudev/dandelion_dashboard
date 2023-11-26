'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Session } from 'next-auth'
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import { Breadcrumb, Layout, Menu, MenuProps, theme } from 'antd'
import { DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined, ShoppingCartOutlined, FileAddOutlined, OrderedListOutlined, LogoutOutlined, SolutionOutlined } from '@ant-design/icons';


import '../globals.css'

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
  // getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Product', 'ProductKey', <ShoppingCartOutlined />, [
    getItem(<Link href="/product">Product</Link>, 'ProductSub1', <OrderedListOutlined />),
    // getItem('Bill', 'ProductSub2', <FileAddOutlined />),
    // getItem('Alex', 'ProductSub3'),
  ]),
  getItem('Order', 'OrderKey', <SolutionOutlined />, [
    getItem(<Link href="/order">Order</Link>, 'OrderSub1', <OrderedListOutlined />),
  ]),
  // getItem('User', 'User1', <UserOutlined />, [
  //   getItem('Tom', 'UserSub1'),
  //   getItem('Bill', 'UserSub2'),
  //   getItem('Alex', 'UserSub3'),
  // ]),
  // getItem('Order', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem(<button onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}>Logout</button>, '9', <LogoutOutlined />),
];

export default function RootLayout({ children, session }: { children: React.ReactNode, session: Session }) {

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer }, } = theme.useToken();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <StyledComponentsRegistry >
            <Layout style={{ minHeight: '100vh' }} hasSider>
              <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
              </Sider>
              <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
              </Layout>
            </Layout>
          </StyledComponentsRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}
