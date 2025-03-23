import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Admin, Resource } from 'react-admin';
import authProvider from './admin/component/authProvider.tsx'; 
import CustomLayout from './admin/layouts/default';
import { ProductList, CategoryCreate, CategoryEdit, UserList, Category, ProductEdit, UserEdit, OrderShow, ProductCreate, OrderList } from './admin/pages/Page';
import myDataProvider from './admin/component/customDataProvider';
import Login from './admin/component/login';
import  Dashboard  from "./admin/pages/Dashboard";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
      <Admin authProvider={authProvider} dashboard={Dashboard} loginPage={Login} dataProvider={myDataProvider} layout={CustomLayout} >
        <Resource name="dashboard" options={{ label: 'Dashboard' }} />
        <Resource name="product" list={ProductList} create={ProductCreate} edit={ProductEdit} />
        <Resource name="user" list={UserList} edit={UserEdit}/>
        <Resource name="category" list={Category} edit={CategoryEdit} create={CategoryCreate}/>
        <Resource name="order" list={OrderList} show={OrderShow}/>
        <Resource name="warehouse" />
       
      </Admin>
   
  </StrictMode>,
);
