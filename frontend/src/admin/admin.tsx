import { Admin, Resource } from 'react-admin';
import authProvider from './component/authProvider.tsx'; 
import CustomLayout from './layouts/default';
import { ProductList, UserList, Category, ProductEdit, UserEdit, ProductCreate } from './pages/Page';
import myDataProvider from './component/customDataProvider';
import Login from './component/login';
import Dashboard from "./pages/Dashboard";

// Sửa lỗi: Trả về JSX trong component admin
const admin = () => {
  return (
    <Admin
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      dataProvider={myDataProvider}
      layout={CustomLayout}
    >
      <Resource name="dashboard" options={{ label: 'Dashboard' }} />
      <Resource name="product" list={ProductList} create={ProductCreate} edit={ProductEdit} />
      <Resource name="user" list={UserList} edit={UserEdit} />
      <Resource name="category" list={Category} />
      <Resource name="warehouse" />
    </Admin>
  );
};

export default admin;
